package grpc

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net"
	"sync"
	"sync/atomic"
	"time"

	"elearning-5/internal/grpc/pb"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Server struct {
	pb.UnimplementedChatServiceServer
	clients       map[string]pb.ChatService_StreamMessagesServer
	clientMutex   sync.RWMutex
	startTime     time.Time
	totalMessages int64
	activeConns   int32
}

func NewServer() *Server {
	return &Server{
		clients:   make(map[string]pb.ChatService_StreamMessagesServer),
		startTime: time.Now(),
	}
}

func (s *Server) Start(port string) error {
	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		return err
	}

	grpcServer := grpc.NewServer(
		grpc.MaxConcurrentStreams(1000),
		grpc.MaxRecvMsgSize(1024*1024), // 1MB
		grpc.MaxSendMsgSize(1024*1024), // 1MB
	)
	pb.RegisterChatServiceServer(grpcServer, s)

	log.Printf("🚀 gRPC server listening on :%s", port)
	return grpcServer.Serve(lis)
}

func (s *Server) SendMessage(ctx context.Context, req *pb.MessageRequest) (*pb.MessageResponse, error) {
	if req.User == "" || req.Message == "" {
		return nil, status.Error(codes.InvalidArgument, "user and message are required")
	}

	atomic.AddInt64(&s.totalMessages, 1)

	response := &pb.MessageResponse{
		Id:        generateID(),
		User:      req.User,
		Message:   req.Message,
		Timestamp: time.Now().Format(time.RFC3339),
		Room:      req.Room,
	}

	// Broadcast to relevant clients
	s.clientMutex.RLock()
	defer s.clientMutex.RUnlock()

	for clientID, stream := range s.clients {
		// Send to clients in the same room or all rooms
		if shouldSendToClient(clientID, req.Room) {
			if err := stream.Send(response); err != nil {
				log.Printf("Failed to send to client %s: %v", clientID, err)
				// Don't remove here, let stream context handle disconnection
			}
		}
	}

	log.Printf("📨 gRPC Message from %s: %s", req.User, req.Message)
	return response, nil
}

func (s *Server) StreamMessages(req *pb.StreamRequest, stream pb.ChatService_StreamMessagesServer) error {
	clientID := generateClientID(req.User, req.Room)

	s.clientMutex.Lock()
	s.clients[clientID] = stream
	atomic.AddInt32(&s.activeConns, 1)
	s.clientMutex.Unlock()

	log.Printf("🔗 gRPC Client connected: %s (Total: %d)", clientID, atomic.LoadInt32(&s.activeConns))

	// Send welcome message
	welcomeMsg := &pb.MessageResponse{
		Id:        generateID(),
		User:      "System",
		Message:   "Welcome to gRPC Chat!",
		Timestamp: time.Now().Format(time.RFC3339),
		Room:      req.Room,
	}
	stream.Send(welcomeMsg)

	// Keep connection alive until client disconnects
	<-stream.Context().Done()

	s.clientMutex.Lock()
	delete(s.clients, clientID)
	atomic.AddInt32(&s.activeConns, -1)
	s.clientMutex.Unlock()

	log.Printf("🔌 gRPC Client disconnected: %s (Total: %d)", clientID, atomic.LoadInt32(&s.activeConns))
	return nil
}

func (s *Server) GetStats(ctx context.Context, req *pb.StatsRequest) (*pb.StatsResponse, error) {
	stats := &pb.StatsResponse{
		ActiveConnections: atomic.LoadInt32(&s.activeConns),
		TotalMessages:     atomic.LoadInt64(&s.totalMessages),
		Uptime:            int64(time.Since(s.startTime).Seconds()),
	}
	return stats, nil
}

func generateID() string {
	return fmt.Sprintf("msg_%d_%d", time.Now().UnixNano(), rand.Int63())
}

func generateClientID(user, room string) string {
	return fmt.Sprintf("%s_%s_%d", user, room, time.Now().UnixNano())
}

func shouldSendToClient(clientID, room string) bool {
	// Simple logic: send to all clients for now
	// In production, implement room-based filtering
	return true
}

package signalr

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

type SignalRServer struct {
	hub      *Hub
	upgrader websocket.Upgrader
}

func NewSignalRServer() *SignalRServer {
	return &SignalRServer{
		hub: NewHub(),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}

func (s *SignalRServer) Start(port string) error {
	go s.hub.Run()

	mux := http.NewServeMux()
	mux.HandleFunc("/signalr", s.handleSignalR)
	mux.HandleFunc("/signalr/health", s.healthCheck)

	handler := cors.Default().Handler(mux)

	log.Printf("🚀 SignalR-like server listening on :%s", port)
	return http.ListenAndServe(":"+port, handler)
}

func (s *SignalRServer) handleSignalR(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("SignalR WebSocket upgrade failed: %v", err)
		return
	}

	connection := &Connection{
		ID:     generateConnectionID(),
		Send:   make(chan []byte, 256),
		Groups: make(map[string]bool),
	}

	s.hub.AddConnection(connection)

	// Start goroutines for this connection
	go s.writePump(conn, connection)
	go s.readPump(conn, connection)
}

func (s *SignalRServer) writePump(conn *websocket.Conn, connection *Connection) {
	defer func() {
		conn.Close()
		s.hub.RemoveConnection(connection.ID)
	}()

	for {
		select {
		case message, ok := <-connection.Send:
			if !ok {
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}
}

func (s *SignalRServer) readPump(conn *websocket.Conn, connection *Connection) {
	defer func() {
		conn.Close()
		s.hub.RemoveConnection(connection.ID)
	}()

	conn.SetReadLimit(512 * 1024)
	conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("SignalR read error: %v", err)
			}
			break
		}

		var signalrMsg SignalRMessage
		if err := json.Unmarshal(message, &signalrMsg); err != nil {
			log.Printf("Invalid SignalR message: %v", err)
			continue
		}

		s.handleSignalRMessage(connection, signalrMsg)
	}
}

func (s *SignalRServer) handleSignalRMessage(conn *Connection, msg SignalRMessage) {
	switch msg.Type {
	case 1: // Invocation
		if msg.Target == "JoinGroup" && len(msg.Arguments) > 0 {
			group := msg.Arguments[0].(string)
			conn.Groups[group] = true

			response := map[string]interface{}{
				"type":   3,
				"result": "Joined group: " + group,
			}
			data, _ := json.Marshal(response)
			conn.Send <- data
		}

	case 2: // StreamItem
		// Handle stream items
	case 3: // Completion
		// Handle completion
	case 4: // StreamInvocation
		// Handle stream invocation
	case 5: // CancelInvocation
		// Handle cancellation
	case 6: // Ping
		// Respond to ping
		response := map[string]interface{}{
			"type": 6,
		}
		data, _ := json.Marshal(response)
		conn.Send <- data
	}
}

func (s *SignalRServer) healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"service":   "signalr",
	})
}

func generateConnectionID() string {
	return fmt.Sprintf("conn_%d_%d", time.Now().UnixNano(), rand.Int63())
}

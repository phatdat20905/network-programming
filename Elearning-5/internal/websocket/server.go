package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Server struct {
	hub *Hub
	mu  sync.RWMutex
}

func NewServer() *Server {
	hub := NewHub()
	return &Server{hub: hub}
}

func (s *Server) Start(port string) error {
	// Start the hub in a goroutine
	go s.hub.Run()

	// Create HTTP router
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/ws", s.handleWebSocket)
	mux.HandleFunc("/health", s.healthCheck)
	mux.HandleFunc("/stats", s.handleStats)
	mux.HandleFunc("/", s.serveHome)

	// CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		Debug:            false,
	}).Handler(mux)

	log.Printf("🚀 WebSocket server starting on :%s", port)
	log.Printf("📡 WebSocket endpoint: ws://localhost:%s/ws", port)
	log.Printf("❤️  Health check: http://localhost:%s/health", port)
	log.Printf("📊 Statistics: http://localhost:%s/stats", port)

	return http.ListenAndServe(":"+port, corsHandler)
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("❌ WebSocket upgrade failed: %v", err)
		return
	}

	client := NewClient(conn, s.hub)
	s.hub.register <- client

	// Start client goroutines
	go client.WritePump()
	go client.ReadPump()

	log.Printf("✅ New WebSocket client connected from %s", r.RemoteAddr)
}

func (s *Server) healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	healthStatus := map[string]interface{}{
		"status":    "healthy",
		"service":   "websocket",
		"timestamp": time.Now().Format(time.RFC3339),
		"clients":   s.hub.GetClientCount(),
		"uptime":    "since server start", // In production, you'd track actual uptime
	}

	if err := json.NewEncoder(w).Encode(healthStatus); err != nil {
		log.Printf("Error encoding health response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func (s *Server) handleStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	stats := s.hub.GetStats()
	statsResponse := map[string]interface{}{
		"active_connections": stats.ActiveConnections,
		"total_messages":     stats.TotalMessages,
		"total_connections":  stats.TotalConnections,
		"timestamp":          time.Now().Format(time.RFC3339),
	}

	if err := json.NewEncoder(w).Encode(statsResponse); err != nil {
		log.Printf("Error encoding stats response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func (s *Server) serveHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	w.Write([]byte(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>WebSocket Server</title>
			<style>
				body { font-family: Arial, sans-serif; margin: 40px; }
				.status { padding: 10px; margin: 10px 0; border-radius: 5px; }
				.healthy { background: #d4edda; color: #155724; }
				.info { background: #d1ecf1; color: #0c5460; }
			</style>
		</head>
		<body>
			<h1>🚀 WebSocket Server is Running</h1>
			<div class="status healthy">
				<strong>Status:</strong> Server is healthy and ready for connections
			</div>
			<div class="status info">
				<h3>Connection Information:</h3>
				<p><strong>WebSocket URL:</strong> ws://localhost:8080/ws</p>
				<p><strong>Health Check:</strong> <a href="/health">/health</a></p>
				<p><strong>Statistics:</strong> <a href="/stats">/stats</a></p>
			</div>
			<div class="status info">
				<h3>Client Usage:</h3>
				<p>Use the main chat application to connect to this WebSocket server.</p>
				<p>The main application is available at: <a href="http://localhost:3000">http://localhost:3000</a></p>
			</div>
		</body>
		</html>
	`))
}

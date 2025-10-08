package websocket

import (
	"fmt"
	"log"
	"math/rand"
	"sync"
	"time"
)

type Message struct {
	ID        string `json:"id"`
	User      string `json:"user"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
	Room      string `json:"room"`
	Type      string `json:"type"` // message, join, leave, system
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
	stats      *Stats
}

type Stats struct {
	TotalMessages     int64 `json:"total_messages"`
	ActiveConnections int   `json:"active_connections"`
	TotalConnections  int64 `json:"total_connections"`
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan Message, 1024),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		stats:      &Stats{},
	}
}

func (h *Hub) Run() {
	log.Println("WebSocket Hub started running...")

	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			h.stats.ActiveConnections = len(h.clients)
			h.stats.TotalConnections++
			h.mutex.Unlock()

			// Send join notification if user is identified
			if client.userID != "" {
				joinMsg := Message{
					ID:        generateMessageID(),
					User:      "System",
					Message:   client.userID + " joined the chat",
					Timestamp: time.Now().Format(time.RFC3339),
					Room:      client.room,
					Type:      "join",
				}
				h.broadcast <- joinMsg
			}

			log.Printf("🔗 Client connected. Total: %d", len(h.clients))

		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				h.stats.ActiveConnections = len(h.clients)
			}
			h.mutex.Unlock()

			// Send leave notification if user was identified
			if client.userID != "" {
				leaveMsg := Message{
					ID:        generateMessageID(),
					User:      "System",
					Message:   client.userID + " left the chat",
					Timestamp: time.Now().Format(time.RFC3339),
					Room:      client.room,
					Type:      "leave",
				}
				h.broadcast <- leaveMsg
			}

			log.Printf("🔌 Client disconnected. Total: %d", len(h.clients))

		case message := <-h.broadcast:
			h.stats.TotalMessages++

			// Ensure message has ID and timestamp
			if message.ID == "" {
				message.ID = generateMessageID()
			}
			if message.Timestamp == "" {
				message.Timestamp = time.Now().Format(time.RFC3339)
			}
			if message.Type == "" {
				message.Type = "message"
			}

			h.mutex.RLock()
			clientsToRemove := make([]*Client, 0)

			for client := range h.clients {
				// Send to clients in the same room or all rooms if room is empty
				shouldSend := client.room == "" || client.room == message.Room || message.Type != "message"

				if shouldSend {
					select {
					case client.send <- message:
						// Message sent successfully
					default:
						// Client is blocking, mark for removal
						clientsToRemove = append(clientsToRemove, client)
					}
				}
			}
			h.mutex.RUnlock()

			// Remove problematic clients
			if len(clientsToRemove) > 0 {
				h.mutex.Lock()
				for _, client := range clientsToRemove {
					if _, ok := h.clients[client]; ok {
						delete(h.clients, client)
						close(client.send)
					}
				}
				h.stats.ActiveConnections = len(h.clients)
				h.mutex.Unlock()

				log.Printf("Removed %d unresponsive clients", len(clientsToRemove))
			}

			if message.Type == "message" {
				log.Printf("📨 Broadcast message from %s in room %s: %s", message.User, message.Room, message.Message)
			}
		}
	}
}

func (h *Hub) GetStats() Stats {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	return *h.stats
}

func (h *Hub) GetClientCount() int {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	return len(h.clients)
}

func generateMessageID() string {
	return fmt.Sprintf("msg_%d_%d", time.Now().UnixNano(), rand.Int63())
}

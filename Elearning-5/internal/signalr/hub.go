package signalr

import (
	"encoding/json"
	"log"
	"sync"
)

type SignalRMessage struct {
	Type         int           `json:"type"`
	Target       string        `json:"target"`
	Arguments    []interface{} `json:"arguments"`
	InvocationId string        `json:"invocationId,omitempty"`
}

type Connection struct {
	ID     string
	Send   chan []byte
	Groups map[string]bool
}

type Hub struct {
	connections map[string]*Connection
	groups      map[string]map[string]bool
	mutex       sync.RWMutex
	broadcast   chan []byte
}

func NewHub() *Hub {
	return &Hub{
		connections: make(map[string]*Connection),
		groups:      make(map[string]map[string]bool),
		broadcast:   make(chan []byte, 1024),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case message := <-h.broadcast:
			h.mutex.RLock()
			for _, conn := range h.connections {
				select {
				case conn.Send <- message:
				default:
					close(conn.Send)
					delete(h.connections, conn.ID)
				}
			}
			h.mutex.RUnlock()
		}
	}
}

func (h *Hub) AddConnection(conn *Connection) {
	h.mutex.Lock()
	defer h.mutex.Unlock()
	h.connections[conn.ID] = conn
	log.Printf("SignalR connection established: %s (Total: %d)", conn.ID, len(h.connections))
}

func (h *Hub) RemoveConnection(connID string) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if conn, exists := h.connections[connID]; exists {
		close(conn.Send)
		delete(h.connections, connID)

		// Remove from all groups
		for group := range h.groups {
			delete(h.groups[group], connID)
		}
	}

	log.Printf("SignalR connection closed: %s (Total: %d)", connID, len(h.connections))
}

func (h *Hub) SendToConnection(connID string, message interface{}) {
	h.mutex.RLock()
	conn, exists := h.connections[connID]
	h.mutex.RUnlock()

	if exists {
		data, err := json.Marshal(message)
		if err != nil {
			log.Printf("Error marshaling message: %v", err)
			return
		}

		select {
		case conn.Send <- data:
		default:
			h.RemoveConnection(connID)
		}
	}
}

func (h *Hub) Broadcast(message interface{}) {
	data, err := json.Marshal(message)
	if err != nil {
		log.Printf("Error marshaling broadcast message: %v", err)
		return
	}

	h.broadcast <- data
}

func (h *Hub) SendToGroup(group string, message interface{}) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()

	if connections, exists := h.groups[group]; exists {
		data, err := json.Marshal(message)
		if err != nil {
			log.Printf("Error marshaling group message: %v", err)
			return
		}

		for connID := range connections {
			if conn, exists := h.connections[connID]; exists {
				select {
				case conn.Send <- data:
				default:
					h.RemoveConnection(connID)
				}
			}
		}
	}
}

func (h *Hub) AddToGroup(connID, group string) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if h.groups[group] == nil {
		h.groups[group] = make(map[string]bool)
	}
	h.groups[group][connID] = true
}

func (h *Hub) RemoveFromGroup(connID, group string) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if connections, exists := h.groups[group]; exists {
		delete(connections, connID)
		if len(connections) == 0 {
			delete(h.groups, group)
		}
	}
}

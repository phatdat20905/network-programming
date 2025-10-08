package websocket

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	hub    *Hub
	conn   *websocket.Conn
	send   chan Message
	userID string
	room   string
}

func NewClient(conn *websocket.Conn, hub *Hub) *Client {
	return &Client{
		hub:  hub,
		conn: conn,
		send: make(chan Message, 256),
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				// Hub closed the channel
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			json.NewEncoder(w).Encode(message)

			// Close writer to flush message
			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512 * 1024) // 512KB
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		var msg Message
		err := c.conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket read error: %v", err)
			}
			break
		}

		// Set user info from first message
		if c.userID == "" && msg.User != "" {
			c.userID = msg.User
			c.room = msg.Room
			log.Printf("User %s joined room %s", c.userID, c.room)
		}

		// Add timestamp if not present
		if msg.Timestamp == "" {
			msg.Timestamp = time.Now().Format(time.RFC3339)
		}

		// Broadcast message to hub
		c.hub.broadcast <- msg
	}
}

func (c *Client) GetUserID() string {
	return c.userID
}

func (c *Client) GetRoom() string {
	return c.room
}

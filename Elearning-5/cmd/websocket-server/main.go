package main

import (
	"elearning-5/internal/websocket"
	"log"
)

func main() {
	server := websocket.NewServer()
	log.Println("Starting WebSocket server on :8080...")
	if err := server.Start("8080"); err != nil {
		log.Fatalf("Failed to start WebSocket server: %v", err)
	}
}

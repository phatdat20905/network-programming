package main

import (
	"elearning-5/internal/signalr"
	"log"
)

func main() {
	server := signalr.NewSignalRServer()
	log.Println("Starting SignalR-like server on :8081...")
	if err := server.Start("8081"); err != nil {
		log.Fatalf("Failed to start SignalR server: %v", err)
	}
}

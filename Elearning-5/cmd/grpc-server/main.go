package main

import (
	grpc "elearning-5/internal/grpc"
	"log"
)

func main() {
	server := grpc.NewServer()
	log.Println("Starting gRPC server on :50051...")
	if err := server.Start("50051"); err != nil {
		log.Fatalf("Failed to start gRPC server: %v", err)
	}
}

package middleware

import (
	"context"
	"strings"

	"google.golang.org/grpc"
)

func AuthInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	// Simple authentication check
	// In production, use proper JWT or OAuth2 validation

	if strings.HasPrefix(info.FullMethod, "/chat.ChatService/") {
		// Add authentication logic here
		// For demo purposes, we'll allow all requests
	}

	return handler(ctx, req)
}

func StreamAuthInterceptor(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
	// Stream authentication interceptor
	return handler(srv, ss)
}

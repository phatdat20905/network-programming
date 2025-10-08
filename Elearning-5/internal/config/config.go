package config

import (
	"os"
	"strconv"
)

type Config struct {
	GRPCPort       string
	WebSocketPort  string
	SignalRPort    string
	MaxConnections int
	EnableTLS      bool
}

func Load() *Config {
	return &Config{
		GRPCPort:       getEnv("GRPC_PORT", "50051"),
		WebSocketPort:  getEnv("WS_PORT", "8080"),
		SignalRPort:    getEnv("SIGNALR_PORT", "8081"),
		MaxConnections: getEnvAsInt("MAX_CONNECTIONS", 10000),
		EnableTLS:      getEnvAsBool("ENABLE_TLS", false),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}

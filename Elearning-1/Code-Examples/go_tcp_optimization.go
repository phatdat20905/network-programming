package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
	"time"
)

const (
	PORT        = 8080
	BUFFER_SIZE = 65536 // 64KB
)

type TCPOptimizer struct{}

func (t *TCPOptimizer) SetSocketOptions(conn net.Conn) {
	fmt.Println("🔧 Applying TCP optimizations...")

	// Convert to TCPConn to access special methods
	if tcpConn, ok := conn.(*net.TCPConn); ok {
		// 1. Set NoDelay (equivalent to TCP_NODELAY)
		if err := tcpConn.SetNoDelay(true); err != nil {
			fmt.Printf("❌ SetNoDelay failed: %v\n", err)
		} else {
			fmt.Println("✅ TCP_NODELAY: Disabled Nagle's algorithm")
		}

		// 2. Set KeepAlive
		if err := tcpConn.SetKeepAlive(true); err != nil {
			fmt.Printf("❌ SetKeepAlive failed: %v\n", err)
		} else {
			fmt.Println("✅ SO_KEEPALIVE: Enabled")
		}

		// 3. Set KeepAlive period
		if err := tcpConn.SetKeepAlivePeriod(30 * time.Second); err != nil {
			fmt.Printf("❌ SetKeepAlivePeriod failed: %v\n", err)
		} else {
			fmt.Println("✅ KeepAlive period: 30 seconds")
		}

		// 4. Set Linger
		if err := tcpConn.SetLinger(5); err != nil {
			fmt.Printf("❌ SetLinger failed: %v\n", err)
		} else {
			fmt.Println("✅ SO_LINGER: 5 seconds")
		}

		// 5. Set read/write deadlines
		if err := tcpConn.SetReadDeadline(time.Now().Add(30 * time.Second)); err != nil {
			fmt.Printf("❌ SetReadDeadline failed: %v\n", err)
		}

		if err := tcpConn.SetWriteDeadline(time.Now().Add(30 * time.Second)); err != nil {
			fmt.Printf("❌ SetWriteDeadline failed: %v\n", err)
		}
	}

	t.PrintConnectionInfo(conn)
}

func (t *TCPOptimizer) PrintConnectionInfo(conn net.Conn) {
	fmt.Println("\n📊 CURRENT CONNECTION INFORMATION:")
	fmt.Printf("   Local Address: %s\n", conn.LocalAddr())
	fmt.Printf("   Remote Address: %s\n", conn.RemoteAddr())

	if tcpConn, ok := conn.(*net.TCPConn); ok {
		file, err := tcpConn.File()
		if err == nil {
			defer file.Close()
			// Can get more information from file descriptor if needed
		}
	}
}

type TCPServer struct {
	optimizer TCPOptimizer
}

func (s *TCPServer) Start() {
	fmt.Println("🚀 TCP OPTIMIZATION SERVER (Golang)")
	fmt.Println("===================================")

	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", PORT))
	if err != nil {
		fmt.Printf("❌ Failed to start server: %v\n", err)
		return
	}
	defer listener.Close()

	fmt.Printf("✅ Server listening on port %d\n", PORT)

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Printf("❌ Accept error: %v\n", err)
			continue
		}

		fmt.Printf("🔗 Client connected from: %s\n", conn.RemoteAddr())

		// Handle client in separate goroutine
		go s.handleClient(conn)
	}
}

func (s *TCPServer) handleClient(conn net.Conn) {
	defer conn.Close()

	// Apply TCP optimizations
	s.optimizer.SetSocketOptions(conn)

	reader := bufio.NewReader(conn)
	writer := bufio.NewWriter(conn)

	for {
		// Read data from client
		message, err := reader.ReadString('\n')
		if err != nil {
			fmt.Printf("🔌 Client %s disconnected | Error: %v\n", conn.RemoteAddr(), err)
			return
		}

		message = strings.TrimSpace(message)
		fmt.Printf("📨 Received from %s: %s\n", conn.RemoteAddr(), message)

		// Respond to client
		response := fmt.Sprintf("Server received: %s at %v", message, time.Now())
		if _, err := writer.WriteString(response + "\n"); err != nil {
			fmt.Printf("❌ Write error: %v\n", err)
			return
		}
		writer.Flush()
		fmt.Printf("📤 Sent response to %s\n", conn.RemoteAddr())

		// Exit if client sends "quit"
		if strings.ToLower(message) == "quit" {
			fmt.Printf("🔌 Client %s requested disconnect\n", conn.RemoteAddr())
			return
		}
	}
}

type TCPClient struct {
	optimizer TCPOptimizer
}

func (c *TCPClient) Start() {
	fmt.Println("🚀 TCP OPTIMIZATION CLIENT (Golang)")
	fmt.Println("===================================")

	conn, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", PORT))
	if err != nil {
		fmt.Printf("❌ Failed to connect to server: %v\n", err)
		return
	}
	defer conn.Close()

	fmt.Printf("✅ Connected to server: %s\n", conn.RemoteAddr())

	// Apply TCP optimizations
	c.optimizer.SetSocketOptions(conn)

	reader := bufio.NewReader(conn)
	writer := bufio.NewWriter(conn)

	// Send and receive data
	for i := 1; i <= 5; i++ {
		message := fmt.Sprintf("Hello Server! Message #%d", i)
		fmt.Printf("📤 Sending: %s\n", message)

		if _, err := writer.WriteString(message + "\n"); err != nil {
			fmt.Printf("❌ Write error: %v\n", err)
			return
		}
		writer.Flush()

		// Receive response
		response, err := reader.ReadString('\n')
		if err != nil {
			fmt.Printf("❌ Read error: %v\n", err)
			return
		}

		fmt.Printf("📨 Received: %s", response)
		time.Sleep(1 * time.Second)
	}

	// End
	writer.WriteString("quit\n")
	writer.Flush()
	fmt.Println("✅ Client finished")
}

func main() {
	if len(os.Args) > 1 && os.Args[1] == "client" {
		client := &TCPClient{}
		client.Start()
	} else {
		server := &TCPServer{}
		server.Start()
	}
}

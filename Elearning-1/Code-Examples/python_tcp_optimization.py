#!/usr/bin/env python3
"""
TCP Optimization Demo - Python Version
Elearning-1: Tối ưu hóa giao thức TCP
"""

import socket
import sys
import time
import threading

class TCPOptimizer:
    @staticmethod
    def set_socket_options(sock):
        """Apply TCP optimizations to socket"""
        print("🔧 Applying TCP optimizations...")
        
        try:
            # 1. TCP_NODELAY - Disable Nagle's algorithm
            sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            print("✅ TCP_NODELAY: Disabled Nagle's algorithm")
        except socket.error as e:
            print(f"❌ TCP_NODELAY failed: {e}")
        
        try:
            # 2. Increase send buffer size
            buffer_size = 65536
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, buffer_size)
            actual_snd = sock.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)
            print(f"✅ SO_SNDBUF: Send buffer = {actual_snd} bytes")
        except socket.error as e:
            print(f"❌ SO_SNDBUF failed: {e}")
        
        try:
            # 3. Increase receive buffer size
            buffer_size = 65536
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, buffer_size)
            actual_rcv = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
            print(f"✅ SO_RCVBUF: Receive buffer = {actual_rcv} bytes")
        except socket.error as e:
            print(f"❌ SO_RCVBUF failed: {e}")
        
        try:
            # 4. Enable keepalive
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
            print("✅ SO_KEEPALIVE: Enabled")
        except socket.error as e:
            print(f"❌ SO_KEEPALIVE failed: {e}")
    
    @staticmethod
    def print_socket_info(sock):
        """Display current socket information"""
        print("\n📊 CURRENT SOCKET INFORMATION:")
        
        try:
            nodelay = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY)
            print(f"   TCP_NODELAY: {'ENABLED' if nodelay else 'DISABLED'}")
        except:
            print("   TCP_NODELAY: Unable to read")
        
        try:
            snd_buf = sock.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)
            print(f"   SO_SNDBUF: {snd_buf} bytes")
        except:
            print("   SO_SNDBUF: Unable to read")
        
        try:
            rcv_buf = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
            print(f"   SO_RCVBUF: {rcv_buf} bytes")
        except:
            print("   SO_RCVBUF: Unable to read")

class TCPServer:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.running = True
    
    def start(self):
        """Start TCP server with optimizations"""
        print("🚀 TCP OPTIMIZATION SERVER (Python)")
        print("===================================")
        
        try:
            # Create TCP socket
            server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Set socket options for server
            server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            print("✅ Socket created successfully")
            
            # Bind and listen
            server_socket.bind((self.host, self.port))
            server_socket.listen(10)
            print(f"✅ Server listening on {self.host}:{self.port}")
            
            while self.running:
                print(f"\n⏳ Waiting for connection...")
                try:
                    client_socket, client_address = server_socket.accept()
                    print(f"🔗 Client connected from: {client_address}")
                    
                    # Handle client in separate thread
                    client_thread = threading.Thread(
                        target=self.handle_client, 
                        args=(client_socket, client_address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                    
                except socket.error as e:
                    if self.running:
                        print(f"❌ Accept error: {e}")
                    
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
        except Exception as e:
            print(f"❌ Server error: {e}")
        finally:
            server_socket.close()
            print("✅ Server shutdown complete")
    
    def handle_client(self, client_socket, client_address):
        """Handle client connection"""
        try:
            # Apply TCP optimizations
            TCPOptimizer.set_socket_options(client_socket)
            TCPOptimizer.print_socket_info(client_socket)
            
            while True:
                # Receive data from client
                data = client_socket.recv(1024)
                if not data:
                    print(f"🔌 Client {client_address} disconnected")
                    break
                
                message = data.decode('utf-8').strip()
                print(f"📨 Received from {client_address}: {message}")
                
                # Send response
                response = f"Server received: {message} at {time.time()}"
                client_socket.send(response.encode('utf-8'))
                print(f"📤 Sent response to {client_address}")
                
                # Check for quit command
                if message.lower() == 'quit':
                    print(f"🔌 Client {client_address} requested disconnect")
                    break
                    
        except socket.error as e:
            print(f"❌ Client handling error: {e}")
        finally:
            client_socket.close()

class TCPClient:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
    
    def start(self):
        """Start TCP client with optimizations"""
        print("🚀 TCP OPTIMIZATION CLIENT (Python)")
        print("===================================")
        
        try:
            # Create TCP socket
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Apply TCP optimizations
            TCPOptimizer.set_socket_options(client_socket)
            
            # Connect to server
            client_socket.connect((self.host, self.port))
            print(f"✅ Connected to server {self.host}:{self.port}")
            
            # Send and receive data
            for i in range(5):
                message = f"Hello Server! Message #{i+1}"
                print(f"📤 Sending: {message}")
                client_socket.send(message.encode('utf-8'))
                
                # Receive response
                response = client_socket.recv(1024).decode('utf-8')
                print(f"📨 Received: {response}")
                
                time.sleep(1)
            
            # Send quit command
            client_socket.send("quit".encode('utf-8'))
            print("✅ Client finished")
            
        except Exception as e:
            print(f"❌ Client error: {e}")
        finally:
            client_socket.close()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "client":
        client = TCPClient()
        client.start()
    else:
        server = TCPServer()
        server.start()
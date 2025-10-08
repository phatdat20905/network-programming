# High-Performance Real-time Chat Application

A high-performance, real-time chat application built with Go, featuring multiple communication protocols: gRPC, WebSocket, and SignalR-like services. Designed for scalability and high concurrency.

## Features

### Core Features
- **Real-time Messaging**: Instant message delivery across multiple protocols
- **Multi-Protocol Support**:
  - WebSocket (Full-duplex communication)
  - gRPC (High-performance RPC)
  - SignalR-like (ASP.NET SignalR compatibility)
- **Room-based Chat**: Support for multiple chat rooms
- **User Management**: Dynamic user connection handling
- **Connection Statistics**: Real-time monitoring of connections and messages

### High-Performance Features
- **Concurrent Design**: Goroutine-based architecture for high concurrency
- **Binary Protocols**: Reduced overhead compared to JSON-REST
- **Connection Pooling**: Efficient client connection management
- **Load Balancing Ready**: Stateless design for horizontal scaling
- **Health Monitoring**: Built-in health checks and statistics

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Client    │───▶│  WebSocket Server │◀──▶│   gRPC Server   │
│  (localhost:3000)│    │   (localhost:8080)  │    │ (localhost:50051) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                     ┌──────────────────┐
                     │ SignalR Server   │
                     │ (localhost:8081) │
                     └──────────────────┘
```

## Technology Stack

### Backend Services
- **Go 1.21**: Primary programming language
- **gRPC**: High-performance RPC framework
- **WebSocket**: Real-time full-duplex communication
- **Custom SignalR-like**: ASP.NET SignalR protocol implementation

### Libraries & Frameworks
- **gorilla/websocket**: WebSocket implementation
- **google.golang.org/grpc**: gRPC framework
- **rs/cors**: CORS middleware
- **golang.org/x/net/http2**: HTTP/2 support

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **HTML5 & CSS3**: Modern responsive design
- **WebSocket API**: Native browser WebSocket support

## Project Structure

```
Elearning-5/
├── cmd/                          # Application entry points
│   ├── grpc-server/
│   │   └── main.go               # gRPC server entry point
│   ├── websocket-server/
│   │   └── main.go               # WebSocket server entry point
│   └── signalr-server/
│       └── main.go               # SignalR server entry point
├── internal/                     # Private application code
│   ├── grpc/                     # gRPC service implementation
│   │   ├── server.go             # gRPC server logic
│   │   └── pb/                   # Protocol Buffer definitions
│   │       ├── chat.proto        # gRPC service definition
│   │       ├── chat.pb.go        # Generated Go code
│   │       └── chat_grpc.pb.go   # Generated gRPC code
│   ├── websocket/                # WebSocket service
│   │   ├── server.go             # WebSocket server
│   │   ├── hub.go                # Connection hub
│   │   └── client.go             # Client management
│   └── signalr/                  # SignalR-like service
│       ├── server.go             # SignalR server
│       └── hub.go                # SignalR hub
├── web/                          # Frontend application
│   ├── index.html                # Main application
│   ├── style.css                 # Styling
│   └── app.js                    # Client-side logic
├── docker/                       # Docker configuration
│   ├── Dockerfile                # Container definition
│   └── docker-compose.yml        # Multi-service orchestration
├── go.mod                        # Go module dependencies
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Go 1.21 or later
- Protocol Buffer Compiler (protoc)
- Git

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd Elearning-5

# Install dependencies
go mod download

# Install protoc-gen-go and protoc-gen-go-grpc
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28.1
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2.0
```

### Step 2: Generate gRPC Code
```bash
# Generate gRPC code from proto definitions
protoc --go_out=internal/grpc --go-grpc_out=internal/grpc internal/grpc/pb/chat.proto
```

## Running the Application

### Method 1: Manual Start (Development)
1. **WebSocket Server** (Terminal 1):
   ```bash
   go run cmd/websocket-server/main.go
   ```
   Output: `🚀 WebSocket server starting on :8080`

2. **gRPC Server** (Terminal 2):
   ```bash
   go run cmd/grpc-server/main.go
   ```
   Output: `🚀 gRPC server listening on :50051`

3. **SignalR Server** (Terminal 3):
   ```bash
   go run cmd/signalr-server/main.go
   ```
   Output: `🚀 SignalR-like server listening on :8081`

4. **Web Client** (Terminal 4):
   ```bash
   cd web && python -m http.server 3000
   ```
   Output: `Serving HTTP on :: port 3000`

### Method 2: Docker Deployment
```bash
# Build and run all services
docker-compose -f docker/docker-compose.yml up --build

# Access the application
open http://localhost
```

## API Documentation

### WebSocket Server (:8080)
- **ws://localhost:8080/ws**: WebSocket connection endpoint
- **GET /health**: Health check
- **GET /stats**: Connection statistics
- **GET /**: Server information page

**Health Check Response**:
```json
{
  "status": "healthy",
  "service": "websocket",
  "timestamp": "2025-10-08T16:20:00Z",
  "clients": 5,
  "uptime": "since server start"
}
```

### gRPC Server (:50051)
**Service Definition**:
```proto
service ChatService {
  rpc SendMessage(MessageRequest) returns (MessageResponse);
  rpc StreamMessages(StreamRequest) returns (stream MessageResponse);
  rpc GetStats(StatsRequest) returns (StatsResponse);
}
```

### SignalR Server (:8081)
- **ws://localhost:8081/signalr**: SignalR WebSocket endpoint
- **GET /signalr/health**: Health check

## Testing

### Health Check Tests
```bash
# Test WebSocket server
curl http://localhost:8080/health

# Test SignalR server
curl http://localhost:8081/signalr/health

# Test WebSocket statistics
curl http://localhost:8080/stats
```

### WebSocket Connection Test
Open browser console and run:
```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
ws.onopen = () => console.log('✅ WebSocket Connected');
ws.onmessage = (e) => console.log('📨 Received:', JSON.parse(e.data));
ws.send(JSON.stringify({
    user: 'TestUser', 
    message: 'Hello WebSocket!',
    room: 'test-room'
}));
```

### Application Test
1. Open Web Interface: `http://localhost:3000`
2. Connect Services: Click "Connect WebSocket"
3. Send Messages:
   - Enter username and room
   - Type message and select protocol
   - Click "Send"
4. Verify Real-time Updates: Messages appear instantly

## Docker Deployment

### Build Custom Image
```bash
# Build the application
docker build -t elearning-chat -f docker/Dockerfile .

# Run container
docker run -p 8080:8080 -p 50051:50051 -p 8081:8081 elearning-chat
```

### Docker Compose
```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down
```

## Performance Features

### Optimized for High Load
- **Goroutine-based Architecture**: Each connection handled in a separate goroutine
- **Binary Protocol Efficiency**: gRPC uses Protocol Buffers for compact messaging
- **Connection Pooling**: Efficient management of client connections
- **Non-blocking I/O**: All network operations are asynchronous

### Configuration Options
Environment variables for customization:
```bash
# Server Ports
GRPC_PORT=50051
WS_PORT=8080
SIGNALR_PORT=8081

# Performance Tuning
MAX_CONNECTIONS=10000
READ_BUFFER_SIZE=1024
WRITE_BUFFER_SIZE=1024
```

## Monitoring & Health Checks

### Built-in Monitoring
- **WebSocket Server**:
  - Active connections count
  - Total messages processed
  - Connection statistics
  - Real-time health status
- **gRPC Server**:
  - Connection metrics
  - Message throughput
  - Service health status

### Health Check Endpoints
| Service       | Endpoint                  | Response                                      |
|---------------|---------------------------|-----------------------------------------------|
| WebSocket     | GET /health              | {"status":"healthy","service":"websocket"}    |
| SignalR       | GET /signalr/health      | {"status":"healthy","service":"signalr"}      |
| WebSocket Stats | GET /stats              | Connection and message statistics            |

## Use Cases

### Ideal For:
- Real-time Chat Applications
- Live Collaboration Tools
- Gaming Backends
- Financial Trading Platforms
- IoT Device Communication
- Multi-protocol API Gateways

### Performance Characteristics:
- ✅ **High Concurrency**: Thousands of simultaneous connections
- ✅ **Low Latency**: Real-time message delivery
- ✅ **Protocol Flexibility**: Multiple communication options
- ✅ **Scalable Architecture**: Easy horizontal scaling

## Quick Start Summary
```bash
# 1. Clone and setup
git clone <repo> && cd Elearning-5
go mod download

# 2. Generate gRPC code
protoc --go_out=internal/grpc --go-grpc_out=internal/grpc internal/grpc/pb/chat.proto

# 3. Run services (separate terminals)
go run cmd/websocket-server/main.go
go run cmd/grpc-server/main.go  
go run cmd/signalr-server/main.go
cd web && python -m http.server 3000

# 4. Access application
open http://localhost:3000
```

---

## 👨‍💻 Tác giả
- **Nhóm thực hiện:** 2
- **Sinh viên thực hiện:** [Ngô Phát Đạt, Nguyễn Thành Đạt]
- **Môn học:** Lập trình Mạng – Elearning-5 
- **GVHD:** Bùi Dương Thế

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

Enjoy building high-performance real-time applications! 🎉
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .
RUN go build -o /grpc-server ./cmd/grpc-server
RUN go build -o /websocket-server ./cmd/websocket-server
RUN go build -o /signalr-server ./cmd/signalr-server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /grpc-server .
COPY --from=builder /websocket-server .
COPY --from=builder /signalr-server .
COPY web ./web

EXPOSE 50051 8080 8081

CMD ["./websocket-server"]
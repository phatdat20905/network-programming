#include <iostream>
#include <string>
#include <thread>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <chrono>

#pragma comment(lib, "ws2_32.lib")

using namespace std;

const int PORT = 8080;
const int BUFFER_SIZE = 1024;

class TCPOptimizer {
public:
    static void setSocketOptions(SOCKET sock) {
        cout << "[INFO] Applying TCP optimizations..." << endl;

        // 1. TCP_NODELAY
        int nodelay = 1;
        if (setsockopt(sock, IPPROTO_TCP, TCP_NODELAY, (char*)&nodelay, sizeof(nodelay)) == 0)
            cout << "[OK] TCP_NODELAY: Disabled Nagle's algorithm" << endl;

        // 2. Send buffer
        int sendBufSize = 65536;
        setsockopt(sock, SOL_SOCKET, SO_SNDBUF, (char*)&sendBufSize, sizeof(sendBufSize));
        cout << "[OK] SO_SNDBUF: " << sendBufSize << " bytes" << endl;

        // 3. Receive buffer
        int recvBufSize = 65536;
        setsockopt(sock, SOL_SOCKET, SO_RCVBUF, (char*)&recvBufSize, sizeof(recvBufSize));
        cout << "[OK] SO_RCVBUF: " << recvBufSize << " bytes" << endl;

        // 4. KeepAlive
        int keepAlive = 1;
        setsockopt(sock, SOL_SOCKET, SO_KEEPALIVE, (char*)&keepAlive, sizeof(keepAlive));
        cout << "[OK] SO_KEEPALIVE: Enabled" << endl;
    }

    static void printSocketInfo(SOCKET sock) {
        cout << "\n=== CURRENT SOCKET INFORMATION ===" << endl;

        int nodelay, size = sizeof(nodelay);
        getsockopt(sock, IPPROTO_TCP, TCP_NODELAY, (char*)&nodelay, &size);
        cout << "   TCP_NODELAY: " << (nodelay ? "ENABLED" : "DISABLED") << endl;

        int sndbuf;
        size = sizeof(sndbuf);
        getsockopt(sock, SOL_SOCKET, SO_SNDBUF, (char*)&sndbuf, &size);
        cout << "   SO_SNDBUF: " << sndbuf << " bytes" << endl;

        int rcvbuf;
        size = sizeof(rcvbuf);
        getsockopt(sock, SOL_SOCKET, SO_RCVBUF, (char*)&rcvbuf, &size);
        cout << "   SO_RCVBUF: " << rcvbuf << " bytes" << endl;
    }
};

class TCPServer {
private:
    SOCKET serverSocket;
    bool running;

public:
    TCPServer() : serverSocket(INVALID_SOCKET), running(true) {}

    void start() {
        cout << "=== TCP OPTIMIZATION SERVER (C++) ===" << endl;

        WSADATA wsaData;
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
            cerr << "[ERROR] WSAStartup failed" << endl;
            return;
        }

        serverSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (serverSocket == INVALID_SOCKET) {
            cerr << "[ERROR] Socket creation failed" << endl;
            WSACleanup();
            return;
        }

        int reuse = 1;
        setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&reuse, sizeof(reuse));

        sockaddr_in serverAddr{};
        serverAddr.sin_family = AF_INET;
        serverAddr.sin_addr.s_addr = INADDR_ANY;
        serverAddr.sin_port = htons(PORT);

        if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
            cerr << "[ERROR] Bind failed" << endl;
            closesocket(serverSocket);
            WSACleanup();
            return;
        }

        if (listen(serverSocket, 10) == SOCKET_ERROR) {
            cerr << "[ERROR] Listen failed" << endl;
            closesocket(serverSocket);
            WSACleanup();
            return;
        }

        cout << "[OK] Server listening on port " << PORT << endl;

        while (running) {
            cout << "\n[INFO] Waiting for connection..." << endl;
            sockaddr_in clientAddr{};
            int clientSize = sizeof(clientAddr);

            SOCKET clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientSize);
            if (clientSocket == INVALID_SOCKET) {
                cerr << "[ERROR] Accept failed" << endl;
                continue;
            }

            char clientIP[INET_ADDRSTRLEN];
            inet_ntop(AF_INET, &clientAddr.sin_addr, clientIP, INET_ADDRSTRLEN);
            cout << "[INFO] Client connected from: " << clientIP << ":" << ntohs(clientAddr.sin_port) << endl;

            thread clientThread(&TCPServer::handleClient, this, clientSocket, string(clientIP));
            clientThread.detach();
        }

        closesocket(serverSocket);
        WSACleanup();
        cout << "[OK] Server shutdown complete" << endl;
    }

    void handleClient(SOCKET clientSocket, string clientIP) {
        TCPOptimizer::setSocketOptions(clientSocket);
        TCPOptimizer::printSocketInfo(clientSocket);

        char buffer[BUFFER_SIZE];
        int bytesReceived;

        while (true) {
            bytesReceived = recv(clientSocket, buffer, BUFFER_SIZE - 1, 0);
            if (bytesReceived <= 0) {
                cout << "[INFO] Client " << clientIP << " disconnected" << endl;
                break;
            }

            buffer[bytesReceived] = '\0';
            cout << "[RECV] " << buffer << endl;

            string response = "Server received: " + string(buffer);
            send(clientSocket, response.c_str(), response.length(), 0);
            cout << "[SEND] Response sent" << endl;

            if (string(buffer) == "quit") {
                cout << "[INFO] Client requested disconnect" << endl;
                break;
            }
        }

        closesocket(clientSocket);
    }
};

class TCPClient {
public:
    void start() {
        cout << "=== TCP OPTIMIZATION CLIENT (C++) ===" << endl;

        WSADATA wsaData;
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
            cerr << "[ERROR] WSAStartup failed" << endl;
            return;
        }

        SOCKET clientSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (clientSocket == INVALID_SOCKET) {
            cerr << "[ERROR] Socket creation failed" << endl;
            WSACleanup();
            return;
        }

        TCPOptimizer::setSocketOptions(clientSocket);

        sockaddr_in serverAddr{};
        serverAddr.sin_family = AF_INET;
        serverAddr.sin_port = htons(PORT);
        inet_pton(AF_INET, "127.0.0.1", &serverAddr.sin_addr);

        if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
            cerr << "[ERROR] Connection failed" << endl;
            closesocket(clientSocket);
            WSACleanup();
            return;
        }
        cout << "[OK] Connected to server localhost:" << PORT << endl;

        char buffer[BUFFER_SIZE];

        for (int i = 1; i <= 5; i++) {
            string message = "Hello Server! Message #" + to_string(i);
            cout << "[SEND] " << message << endl;

            send(clientSocket, message.c_str(), message.size(), 0);

            int bytesReceived = recv(clientSocket, buffer, BUFFER_SIZE - 1, 0);
            if (bytesReceived > 0) {
                buffer[bytesReceived] = '\0';
                cout << "[RECV] " << buffer << endl;
            }

            this_thread::sleep_for(chrono::seconds(1));
        }

        send(clientSocket, "quit", 4, 0);
        cout << "[OK] Client finished" << endl;

        closesocket(clientSocket);
        WSACleanup();
    }
};

int main(int argc, char* argv[]) {
    cout << "TCP Optimization Demo - C++ Version" << endl;

    if (argc > 1 && string(argv[1]) == "client") {
        TCPClient client;
        client.start();
    } else {
        TCPServer server;
        server.start();
    }

    return 0;
}

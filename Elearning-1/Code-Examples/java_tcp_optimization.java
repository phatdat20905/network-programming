import java.io.*;
import java.net.*;
import java.util.Date;

/**
 * TCP Optimization Demo - Java Version
 * Elearning-1: Toi uu hoa giao thuc TCP
 */
public class java_tcp_optimization {
    private static final int PORT = 8080;
    private static final int BUFFER_SIZE = 65536; // 64KB
    
    public static class TCPOptimizer {
        public static void setSocketOptions(Socket socket) {
            System.out.println("[INFO] Applying TCP optimizations...");
            
            try {
                // 1. TCP_NODELAY - Disable Nagle's algorithm
                socket.setTcpNoDelay(true);
                System.out.println("[OK] TCP_NODELAY: Disabled Nagle's algorithm");
                
                // 2. Set send buffer size
                socket.setSendBufferSize(BUFFER_SIZE);
                System.out.println("[OK] SO_SNDBUF: Send buffer = " + 
                                 socket.getSendBufferSize() + " bytes");
                
                // 3. Set receive buffer size
                socket.setReceiveBufferSize(BUFFER_SIZE);
                System.out.println("[OK] SO_RCVBUF: Receive buffer = " + 
                                 socket.getReceiveBufferSize() + " bytes");
                
                // 4. Enable keepalive
                socket.setKeepAlive(true);
                System.out.println("[OK] SO_KEEPALIVE: Enabled");
                
                // 5. Set timeout
                socket.setSoTimeout(30000); // 30 seconds
                System.out.println("[OK] SO_TIMEOUT: 30 seconds");
                
                // 6. Set linger
                socket.setSoLinger(true, 5); // 5 seconds
                System.out.println("[OK] SO_LINGER: 5 seconds");
                
            } catch (SocketException e) {
                System.err.println("[ERROR] Socket options error: " + e.getMessage());
            }
        }
        
        public static void printSocketInfo(Socket socket) {
            System.out.println("\n[INFO] CURRENT SOCKET INFORMATION:");
            
            try {
                System.out.println("   TCP_NODELAY: " + (socket.getTcpNoDelay() ? "ENABLED" : "DISABLED"));
                System.out.println("   SO_SNDBUF: " + socket.getSendBufferSize() + " bytes");
                System.out.println("   SO_RCVBUF: " + socket.getReceiveBufferSize() + " bytes");
                System.out.println("   SO_KEEPALIVE: " + (socket.getKeepAlive() ? "ENABLED" : "DISABLED"));
                System.out.println("   SO_TIMEOUT: " + socket.getSoTimeout() + " ms");
                System.out.println("   SO_LINGER: " + socket.getSoLinger());
                
            } catch (SocketException e) {
                System.err.println("[ERROR] Error reading socket info: " + e.getMessage());
            }
        }
    }
    
    public static class TCPServer {
        public void start() {
            System.out.println("[START] TCP OPTIMIZATION SERVER (Java)");
            System.out.println("=================================");
            
            try (ServerSocket serverSocket = new ServerSocket(PORT)) {
                // Set server socket options
                setServerSocketOptions(serverSocket);
                System.out.println("[OK] Server listening on port " + PORT);
                
                while (true) {
                    Socket clientSocket = serverSocket.accept();
                    System.out.println("[INFO] Client connected from: " + 
                                      clientSocket.getRemoteSocketAddress());
                    
                    // Handle client in separate thread
                    new ClientHandler(clientSocket).start();
                }
                
            } catch (IOException e) {
                System.err.println("[ERROR] Server error: " + e.getMessage());
            }
        }
        
        private void setServerSocketOptions(ServerSocket serverSocket) {
            try {
                // REUSEADDR to reuse address
                serverSocket.setReuseAddress(true);
                System.out.println("[OK] SO_REUSEADDR: Enabled address reuse");
                
            } catch (SocketException e) {
                System.err.println("[ERROR] Server socket options error: " + e.getMessage());
            }
        }
    }
    
    public static class ClientHandler extends Thread {
        private Socket clientSocket;
        
        public ClientHandler(Socket socket) {
            this.clientSocket = socket;
        }
        
        @Override
        public void run() {
            try {
                // Apply TCP optimizations
                TCPOptimizer.setSocketOptions(clientSocket);
                TCPOptimizer.printSocketInfo(clientSocket);
                
                // Create streams for reading/writing data
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    System.out.println("[SERVER] Received from client: " + inputLine);
                    
                    // Respond to client
                    String response = "Server received: " + inputLine + " at " + new Date();
                    out.println(response);
                    System.out.println("[SERVER] Sent response to client");
                    
                    // Exit if client sends "quit"
                    if ("quit".equalsIgnoreCase(inputLine)) {
                        break;
                    }
                }
                
                System.out.println("[INFO] Client disconnected: " + 
                                 clientSocket.getRemoteSocketAddress());
                
            } catch (IOException e) {
                System.err.println("[ERROR] Client handling error: " + e.getMessage());
            } finally {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    System.err.println("[ERROR] Error closing client socket: " + e.getMessage());
                }
            }
        }
    }
    
    public static class TCPClient {
        public void start() {
            System.out.println("[START] TCP OPTIMIZATION CLIENT (Java)");
            System.out.println("=================================");
            
            try (Socket socket = new Socket("localhost", PORT)) {
                // Apply TCP optimizations
                TCPOptimizer.setSocketOptions(socket);
                System.out.println("[OK] Connected to server: " + socket.getRemoteSocketAddress());
                
                // Create streams for reading/writing data
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));
                
                // Send and receive data
                for (int i = 1; i <= 5; i++) {
                    String message = "Hello Server! Message #" + i;
                    System.out.println("[CLIENT] Sending: " + message);
                    out.println(message);
                    
                    // Receive response
                    String response = in.readLine();
                    System.out.println("[CLIENT] Received: " + response);
                    
                    Thread.sleep(1000); // Wait 1 second
                }
                
                // End
                out.println("quit");
                System.out.println("[OK] Client finished");
                
            } catch (IOException | InterruptedException e) {
                System.err.println("[ERROR] Client error: " + e.getMessage());
            }
        }
    }
    
    public static void main(String[] args) {
        if (args.length > 0 && "client".equals(args[0])) {
            new TCPClient().start();
        } else {
            new TCPServer().start();
        }
    }
}

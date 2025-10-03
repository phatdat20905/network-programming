using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length > 0 && args[0] == "client")
            StartClient();
        else
            StartServer();
    }

    static void StartServer()
    {
        Console.WriteLine("🚀 TCP Optimization Server (C#)");
        Console.WriteLine("================================");
        
        TcpListener server = new TcpListener(IPAddress.Any, 8080);
        server.Start();
        Console.WriteLine("✅ Server listening on port 8080...");

        while (true)
        {
            Console.WriteLine("\n⏳ Waiting for connection...");
            TcpClient client = server.AcceptTcpClient();
            Console.WriteLine("🔗 Client connected!");

            // Xử lý client trong thread mới
            Thread clientThread = new Thread(() => HandleClient(client));
            clientThread.Start();
        }
    }

    static void HandleClient(TcpClient client)
    {
        NetworkStream stream = client.GetStream();
        byte[] buffer = new byte[1024];

        try
        {
            // Áp dụng tối ưu hóa TCP
            SetupTCPOptimizations(client.Client);
            PrintSocketInfo(client.Client);

            while (true)
            {
                // Nhận dữ liệu từ client
                int bytesRead = stream.Read(buffer, 0, buffer.Length);
                if (bytesRead == 0)
                {
                    Console.WriteLine("🔌 Client disconnected");
                    break;
                }

                string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                Console.WriteLine($"📨 Received: {message}");

                // Gửi phản hồi
                string response = $"Server received: {message} at {DateTime.Now}";
                byte[] responseData = Encoding.UTF8.GetBytes(response);
                stream.Write(responseData, 0, responseData.Length);
                Console.WriteLine("📤 Sent response to client");

                // Thoát nếu client gửi "quit"
                if (message.Trim().ToLower() == "quit")
                {
                    Console.WriteLine("🔌 Client requested disconnect");
                    break;
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine($"❌ Client error: {e.Message}");
        }
        finally
        {
            stream.Close();
            client.Close();
        }
    }

    static void StartClient()
    {
        Console.WriteLine("🚀 TCP Optimization Client (C#)");
        Console.WriteLine("================================");

        try
        {
            TcpClient client = new TcpClient();
            client.Connect("localhost", 8080);
            Console.WriteLine("✅ Connected to server!");

            // Áp dụng tối ưu hóa TCP
            SetupTCPOptimizations(client.Client);

            NetworkStream stream = client.GetStream();

            // Gửi và nhận dữ liệu
            for (int i = 1; i <= 5; i++)
            {
                string message = $"Hello Server! Message #{i}";
                Console.WriteLine($"📤 Sending: {message}");

                byte[] data = Encoding.UTF8.GetBytes(message);
                stream.Write(data, 0, data.Length);

                // Nhận phản hồi
                byte[] buffer = new byte[1024];
                int bytesRead = stream.Read(buffer, 0, buffer.Length);
                string response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                Console.WriteLine($"📨 Received: {response}");

                Thread.Sleep(1000);
            }

            // Gửi lệnh thoát
            byte[] quitData = Encoding.UTF8.GetBytes("quit");
            stream.Write(quitData, 0, quitData.Length);
            Console.WriteLine("✅ Client finished");

            stream.Close();
            client.Close();
        }
        catch (Exception e)
        {
            Console.WriteLine($"❌ Client error: {e.Message}");
        }
    }

    static void SetupTCPOptimizations(Socket socket)
    {
        Console.WriteLine("🔧 Applying TCP optimizations...");
        
        try
        {
            // 1. TCP_NODELAY - Tắt Nagle's algorithm
            socket.NoDelay = true;
            Console.WriteLine("✅ TCP_NODELAY: Disabled Nagle's algorithm");
            
            // 2. Tăng kích thước send buffer
            socket.SendBufferSize = 65536;
            Console.WriteLine($"✅ SO_SNDBUF: Send buffer = {socket.SendBufferSize} bytes");
            
            // 3. Tăng kích thước receive buffer
            socket.ReceiveBufferSize = 65536;
            Console.WriteLine($"✅ SO_RCVBUF: Receive buffer = {socket.ReceiveBufferSize} bytes");
            
            // 4. Set linger option
            socket.LingerState = new LingerOption(true, 5);
            Console.WriteLine("✅ SO_LINGER: 5 seconds");
            
            // 5. Set TTL
            socket.Ttl = 64;
            Console.WriteLine("✅ TTL: 64 hops");
        }
        catch (Exception e)
        {
            Console.WriteLine($"❌ Socket options error: {e.Message}");
        }
    }

    static void PrintSocketInfo(Socket socket)
    {
        Console.WriteLine("\n📊 CURRENT SOCKET INFORMATION:");
        Console.WriteLine($"   TCP_NODELAY: {(socket.NoDelay ? "ENABLED" : "DISABLED")}");
        Console.WriteLine($"   SO_SNDBUF: {socket.SendBufferSize} bytes");
        Console.WriteLine($"   SO_RCVBUF: {socket.ReceiveBufferSize} bytes");
        Console.WriteLine($"   TTL: {socket.Ttl}");
    }
}
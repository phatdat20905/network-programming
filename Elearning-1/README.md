# 🚀 Elearning-1: Tối Ưu Hóa Giao Thức TCP

## 📋 Giới thiệu
Bài tập này nghiên cứu các **phương pháp tối ưu hóa TCP** và triển khai minh họa trên nhiều ngôn ngữ lập trình.  
Nội dung tập trung vào việc so sánh kỹ thuật tối ưu, cách thức triển khai và đánh giá hiệu quả.

---

## 🎯 Mục tiêu
- Hiểu các kỹ thuật tối ưu hóa TCP phổ biến.  
- So sánh mức độ hỗ trợ giữa các ngôn ngữ lập trình.  
- Triển khai code demo **client–server** minh họa.  

---

## 📊 Bảng so sánh tối ưu TCP

| Phương pháp     | Mục tiêu         | C++ | Python | C# | Java | Golang |
|-----------------|-----------------|-----|--------|----|------|--------|
| **TCP_NODELAY** | Giảm độ trễ      | ✅  | ✅     | ✅ | ✅   | ✅     |
| **Buffer Tuning** | Tăng throughput | ✅  | ✅     | ✅ | ✅   | ✅     |
| **TCP_QUICKACK** | ACK nhanh       | ✅  | ❌     | ❌ | ❌   | ❌     |
| **TCP_CORK**    | Gom packet      | ✅  | ❌     | ❌ | ❌   | ❌     |
| **KeepAlive**   | Duy trì kết nối | ✅  | ✅     | ✅ | ✅   | ✅     |

---

## 📁 Cấu trúc dự án

```
Elearning-1/
│
├── 📊 TCP_Optimization_Comparison.xlsx    # Bảng so sánh tối ưu TCP
├── 📁 Code-Examples/                      # Thư mục chứa code demo
│   ├── cpp_tcp_optimization.cpp           # C++ Implementation
│   ├── python_tcp_optimization.py         # Python Implementation  
│   ├── csharp_tcp_optimization.cs         # C# Implementation
│   ├── java_tcp_optimization.java         # Java Implementation
│   └── go_tcp_optimization.go             # Golang Implementation
└── 📖 README.md                           # Tài liệu hướng dẫn
```

---

### Clone dự án

```bash
git clone https://github.com/phatdat20905/network-programming.git
cd Elearning-3/Code-Examples
```

## 🛠 Hướng dẫn chạy nhanh

### 1. C++ Implementation
```bash
# Biên dịch
g++ -o tcp_optimization cpp_tcp_optimization.cpp -lws2_32

# Chạy server
./tcp_optimization

# Chạy client (terminal khác)
./tcp_optimization client
```

### 2. Python Implementation
```bash
# Chạy server
python python_tcp_optimization.py

# Chạy client
python python_tcp_optimization.py client
```

### 3. C# Implementation
```bash
# Tạo project mới
dotnet new console -n CSharpTCP
cd CSharpTCP

# Copy file code vào project
cp ../csharp_tcp_optimization.cs .

# Xóa file Program.cs mặc định
rm Program.cs

# Chạy server
dotnet run

# Chạy client (ở terminal khác)
dotnet run -- client
```

### 4. Java Implementation
```bash
# Biên dịch
javac java_tcp_optimization.java

# Chạy server
java java_tcp_optimization

# Chạy client
java java_tcp_optimization client
```

### 5. Golang Implementation
```bash
# Chạy server
go run go_tcp_optimization.go

# Chạy client
go run go_tcp_optimization.go client
```

---

## 🔧 Yêu cầu môi trường

- **C++**: g++ (MinGW trên Windows, GCC/Clang trên Linux)  
- **Python**: Python 3.6+  
- **C#**: Mono hoặc .NET SDK  
- **Java**: JDK 8+  
- **Golang**: Go 1.16+  

---

## 📖 Tổng kết

### Thành phần hoàn chỉnh
1. ✅ **Bảng so sánh Excel** – cung cấp thông tin chi tiết.  
2. ✅ **5 file code demo** – C++, Python, C#, Java, Golang.  
3. ✅ **Hướng dẫn chạy** – rõ ràng cho cả Windows và Linux.  
4. ✅ **Phân tích hiệu suất** – đánh giá khách quan.  

### Điểm nổi bật
- **Tính thực tiễn cao**: Code có thể chạy ngay.  
- **Đa ngôn ngữ**: 5 ngôn ngữ phổ biến nhất.  
- **Cross-platform**: Hỗ trợ cả Windows và Linux.  
- **Tài liệu đầy đủ**: Dễ triển khai, dễ học tập.  

### Ứng dụng
- Học tập và nghiên cứu TCP optimization.  
- Tham khảo cho các dự án thực tế.  
- So sánh hiệu suất đa ngôn ngữ.  
- Nâng cao khả năng tuning hiệu suất mạng.  

---

✨ Bộ bài tập này mang đến **cái nhìn toàn diện** về tối ưu hóa TCP và sự khác biệt trong triển khai trên nhiều ngôn ngữ lập trình.  

---

## 👨‍💻 Tác giả
- **Nhóm thực hiện:** 2
- **Sinh viên thực hiện:** [Ngô Phát Đạt, Nguyễn Thành Đạt]
- **Môn học:** Lập trình Mạng – Elearning-1  
- **GVHD:** Bùi Dương Thế

---

## 📜 Giấy phép

Dự án phát hành theo **MIT License** – tự do sử dụng cho mục đích học tập và nghiên cứu.
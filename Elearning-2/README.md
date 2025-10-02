# 🚀 UDP Protocol Optimization - Elearning 2

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![UDP](https://img.shields.io/badge/Protocol-UDP-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Ứng dụng mô phỏng **kỹ thuật tối ưu hóa giao thức UDP** cho môn học *Lập trình Mạng (Elearning-2)*.

---

## 📋 Giới thiệu

UDP là giao thức truyền tải nhanh nhưng không đảm bảo độ tin cậy. Trong dự án này, chúng ta xây dựng mô phỏng **các kỹ thuật tối ưu hóa UDP** nhằm cải thiện hiệu suất và đảm bảo dữ liệu, bao gồm:

- **📦 Packet Bundling** – Gộp nhiều message thành một gói UDP để giảm overhead.  
- **🔄 Selective Retransmission** – Chỉ gửi lại gói bị mất thay vì toàn bộ.  
- **✅ ACK-based Reliability** – Sử dụng ACK để xác nhận từng gói tin.  
- **⏱️ Timeout & RTT Estimation** – Ước lượng thời gian chờ dựa trên RTT.  
- **🚫 Loss Detection & Handling** – Mô phỏng mất gói và xử lý thông minh.  
- **🔢 Sequence Numbering & Duplicate Prevention** – Đánh số gói để đảm bảo thứ tự và tránh trùng lặp.  

---

## 🏗️ Cấu trúc Project

```
Elearning-2/
│
├── src/
│   ├── optimized_udp_server.py   # Server UDP tối ưu hóa
│   ├── optimized_udp_client.py   # Client UDP tối ưu hóa
│   └── demo_optimization.py      # File chạy demo tổng hợp
│
├── requirements.txt              # Thư viện cần thiết
├── README.md                     # Tài liệu mô tả dự án
└── .gitignore
```

---

## ⚙️ Yêu cầu hệ thống

- Python >= 3.8  
- Git  
- Môi trường: Linux / MacOS / Windows  

---

## 🚀 Cài đặt & Chạy thử

### 1. Clone dự án

```bash
git clone https://github.com/phatdat20905/network-programming.git
cd Elearning-2
```

### 2. (Tùy chọn) Tạo virtual environment

```bash
python -m venv venv
source venv/bin/activate   # Linux/MacOS
venv\Scripts\activate    # Windows
```

### 3. Cài dependencies

```bash
pip install -r requirements.txt
```

### 4. Chạy Demo

```bash
# Chạy demo tự động (server + client)
python src/demo_optimization.py
```

🎬 **Demo sẽ minh họa toàn bộ các kỹ thuật tối ưu hóa UDP**.

### 5. Chạy thủ công từng phần

```bash
# Terminal 1 - Khởi động Server
python src/optimized_udp_server.py

# Terminal 2 - Khởi động Client
python src/optimized_udp_client.py
```

---

## 📊 Thống kê trong Demo

Trong quá trình chạy, ứng dụng sẽ hiển thị:

- Số lượng gói tin đã gửi và đã nhận.  
- Số lượng ACK được xác nhận.  
- Tỉ lệ mất gói & gói bị loại bỏ do duplicate.  
- RTT trung bình & tỉ lệ thành công.  
- Trạng thái gói chưa được ACK.  

---

## 🧪 Minh họa các kỹ thuật đã cài đặt

✔️ **Packet Bundling** – Gửi nhiều tin nhắn trong một gói UDP.  
✔️ **Selective Retransmission** – Chỉ gửi lại gói mất.  
✔️ **ACK-based Reliability** – Server gửi ACK cho client.  
✔️ **Loss Detection** – Mô phỏng mất gói với xác suất.  
✔️ **Sequence Numbering** – Đảm bảo thứ tự, tránh duplicate.  

---

## 📚 Ghi chú học tập

- UDP mặc định *không đảm bảo tin cậy* → cần bổ sung kỹ thuật.  
- Các tối ưu hóa này giúp UDP gần giống TCP về độ tin cậy nhưng vẫn nhanh hơn nhờ tính **connectionless**.  
- Demo này chỉ mang tính **mô phỏng học thuật**, chưa áp dụng trong môi trường sản xuất thực tế.  

---

## 👨‍💻 Tác giả
- **Nhóm thực hiện:** 2
- **Sinh viên thực hiện:** [Ngô Phát Đạt, Nguyễn Thành Đạt]
- **Môn học:** Lập trình Mạng – Elearning-2  
- **GVHD:** Bùi Dương Thế

---

## 📜 Giấy phép

Dự án phát hành theo **MIT License** – tự do sử dụng cho mục đích học tập và nghiên cứu.


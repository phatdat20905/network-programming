# ☕ Elearning-3: Quán Cà Phê Bất đồng bộ

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Async](https://img.shields.io/badge/Async-Await-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Ứng dụng mô phỏng quán cà phê sử dụng kỹ thuật **lập trình bất đồng bộ** để tăng hiệu suất làm việc đồng thời của các tác vụ.

---

## 📋 Giới thiệu
Dự án Elearning-3 môn *Lập trình Mạng* minh họa các kỹ thuật bất đồng bộ thông qua mô phỏng hệ thống phục vụ cà phê thực tế:

- 🧑‍🍳 Baristas (workers) xử lý đơn hàng song song  
- 👥 Khách hàng đến đặt hàng ngẫu nhiên  
- ☕ Pha chế cà phê bất đồng bộ  
- 📊 Thống kê real-time  
- ⚡ Hiệu suất cao với xử lý đồng thời  

---

## 🏗️ Cấu trúc Project
```
Elearning-3/
│
├── src/
│   └── async_coffee_shop.py          # Ứng dụng chính - Quán cà phê bất đồng bộ
│
├── README.md                     # Hướng dẫn chi tiết (bạn đang đọc)
├── requirements.txt                  # Thư viện cần thiết
└── .gitignore                        # Git ignore file
```

---

## 🚀 Cách chạy

### Yêu cầu hệ thống
- Python 3.8+
- Không cần cài thêm thư viện ngoài

### Chạy ứng dụng
```bash
# Clone repository
git clone https://github.com/phatdat20905/network-programming.git
cd Elearning-3

# Chạy ứng dụng chính
python src/async_coffee_shop.py
```

---

## 🎯 Kỹ thuật bất đồng bộ được minh họa

### 1. Async/Await Pattern
```python
async def brew_coffee(self, order):
    await asyncio.sleep(brew_time)  # Không block event loop
```

### 2. Concurrent Task Execution
```python
tasks = [brew_task, prep_task]
await asyncio.gather(*tasks)  # Chạy song song nhiều task
```

### 3. Producer-Consumer với Queue
```python
# Producer: khách hàng đặt hàng
await self.order_queue.put(order)

# Consumer: barista xử lý đơn
order = await self.order_queue.get()
```

### 4. Multiple Workers
```python
# 3 baristas làm việc song song
await self.start_baristas(3)
```

### 5. Non-blocking Operations
Mọi thao tác chờ đều sử dụng **await** để không block event loop.

---

## 📊 Kết quả mô phỏng

### Live Output
```
🆕 ĐƠN HÀNG #1: An - Latte (Lớn)
🧑‍🍳 BARISTA #1 NHẬN ĐƠN #1
🔥 Barista đang pha #1: Latte cho An...
✅ Đã pha xong #1: Latte
🎉 Đã phục vụ #1: Latte cho An
⏱️ ĐƠN #1 HOÀN THÀNH trong 6.8s

📈 THỐNG KÊ QUÁN [14:35:10]
   📋 Đơn hàng đang chờ: 1
   ✅ Đơn đã phục vụ: 8
   🧑‍🍳 Số barista đang làm: 3
```

### Báo cáo tổng kết mẫu
```
============================================================
📊 BÁO CÁO TỔNG KẾT QUÁN CÀ PHÊ
============================================================
📈 TỔNG SỐ ĐƠN HÀNG: 28
✅ ĐƠN THÀNH CÔNG: 28
❌ ĐƠN THẤT BẠI: 0
🎯 TỶ LỆ THÀNH CÔNG: 100.0%
⏱️ Thời gian phục vụ trung bình: 8.8s

🏆 TOP ĐỒ UỐNG PHỔ BIẾN:
   ☕ Matcha Latte: 7 đơn
   ☕ Americano: 6 đơn  
   ☕ Cappuccino: 5 đơn

🎉 KẾT THÚC MÔ PHỎNG QUÁN CÀ PHÊ BẤT ĐỒNG BỘ
```

---

## 💡 Lợi ích bất đồng bộ

- 🚀 **Hiệu suất vượt trội**: Xử lý đồng thời nhiều đơn hàng  
- ⏱️ **Không block**: Vẫn nhận đơn mới trong khi pha chế  
- 🧑‍🍳 **Tận dụng tài nguyên**: 3 baristas làm việc song song  

**Kết quả:** 28 đơn hàng xử lý trong 2 phút, trung bình 8.8s/đơn, tỷ lệ thành công 100%.

---

## 📚 Lý thuyết bất đồng bộ

### Lập trình Đồng bộ (Synchronous)
- Thực hiện tuần tự từng tác vụ  
- Chương trình bị dừng khi chờ I/O  

### Lập trình Bất đồng bộ (Asynchronous)
- Nhiều tác vụ chạy đồng thời  
- Không block khi chờ I/O  
- Sử dụng **async/await** và **event loop** để quản lý task  

---

## 🔧 Kiến trúc hệ thống

### Class Diagram
```
AsyncCoffeeShop
├── order_queue: asyncio.Queue
├── completed_orders: List[CoffeeOrder]
├── baristas: List[Task]
├── coffee_menu: Dict
└── is_open: bool

CoffeeOrder
├── id: int
├── customer_name: str
├── coffee_type: str
├── status: OrderStatus
├── placed_at: datetime
└── completed_at: datetime
```

### Luồng hoạt động chính
1. Khởi động hệ thống với 3 baristas  
2. Khách hàng tạo đơn hàng ngẫu nhiên  
3. Baristas lấy đơn từ queue để xử lý  
4. Pha chế song song và chuẩn bị topping  
5. Hiển thị thống kê real-time mỗi 10s  
6. Xuất báo cáo tổng kết khi kết thúc  

---

## 🎮 Tính năng nổi bật

- **Menu đa dạng**: 7 loại cà phê, 3 kích thước, 5 tùy chọn đặc biệt  
- **Xử lý thông minh**: tự động cân bằng tải, xử lý song song, shutdown an toàn  
- **Thống kê chi tiết**: đơn hàng chờ, đơn hoàn thành, thời gian trung bình, top đồ uống  

---

## 📈 Hiệu suất và Tối ưu

- **Throughput**: ~1.5 đơn/giây  
- **Latency**: 8.8s trung bình  
- **Success Rate**: 100%  
- **Concurrency**: 3 baristas làm việc song song  

Tối ưu hóa: Dynamic task management, Queue optimization, Resource pooling

---

## 🐛 Xử lý lỗi

### Error Handling
```python
try:
    await self.process_single_order(barista_id, order)
except Exception as e:
    print(f"❌ Lỗi xử lý đơn #{order.id}: {e}")
    order.status = OrderStatus.FAILED
```

### Graceful Shutdown
```python
async def shutdown(self):
    self.is_open = False
    await self.order_queue.join()
    for barista in self.baristas:
        barista.cancel()
```

---

## 🌟 Kết luận
Ứng dụng đã thành công minh họa các kỹ thuật bất đồng bộ thông qua mô phỏng quán cà phê, cho thấy rõ lợi ích về hiệu suất khi xử lý đồng thời nhiều tác vụ.  
Với khả năng xử lý 28 đơn hàng trong 2 phút và tỷ lệ thành công 100%, đây là minh chứng thuyết phục cho sức mạnh của **lập trình bất đồng bộ** trong thực tế.

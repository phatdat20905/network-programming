"""
QUÁN CÀ PHÊ BẤT ĐỒNG BỘ
Mô phỏng hệ thống phục vụ cà phê sử dụng kỹ thuật bất đồng bộ
Môn: Lập trình Mạng - Elearning-3
"""

import asyncio
import random
import time
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict
import itertools

class OrderStatus(Enum):
    PLACED = "Đã đặt hàng"
    BREWING = "Đang pha chế"
    READY = "Sẵn sàng"
    SERVED = "Đã phục vụ"
    FAILED = "Thất bại"

@dataclass
class CoffeeOrder:
    id: int
    customer_name: str
    coffee_type: str
    size: str
    special_requests: List[str]
    status: OrderStatus
    placed_at: datetime
    completed_at: datetime = None

class AsyncCoffeeShop:
    def __init__(self):
        self.order_queue = asyncio.Queue()
        self.completed_orders = []
        self.order_counter = itertools.count(1)
        self.is_open = True
        self.baristas = []
        self.active_tasks = set()  # 🔧 THEM: Theo dõi các task đang chạy
        
        # Menu cà phê với thời gian pha chế ước tính (giây)
        self.coffee_menu = {
            "Espresso": {"time": (2, 4), "price": 35000},
            "Cappuccino": {"time": (3, 5), "price": 45000},
            "Latte": {"time": (4, 6), "price": 50000},
            "Americano": {"time": (2, 3), "price": 40000},
            "Mocha": {"time": (5, 7), "price": 55000},
            "Cold Brew": {"time": (1, 2), "price": 42000},
            "Matcha Latte": {"time": (4, 6), "price": 48000}
        }
        
        self.sizes = ["Nhỏ", "Vừa", "Lớn"]
        self.special_options = ["Thêm đường", "Ít đá", "Không đường", "Thêm sữa", "Syrup vani"]
        
        print("☕ KHỞI ĐỘNG QUÁN CÀ PHÊ BẤT ĐỒNG BỘ")
        print("=" * 50)
        print("Hệ thống đang mô phỏng quy trình phục vụ cà phê...")
        print()

    async def customer_arrival(self):
        """Mô phỏng khách hàng đến đặt hàng"""
        print("👥 BẮT ĐẦU MÔ PHỎNG KHÁCH HÀNG ĐẾN ĐẶT HÀNG")
        
        customer_names = ["An", "Bình", "Chi", "Dũng", "Hương", "Minh", "Phong", "Thảo", "Việt", "Linh"]
        
        while self.is_open:
            try:
                # Khách hàng đến ngẫu nhiên mỗi 2-8 giây
                await asyncio.sleep(random.uniform(2, 8))
                
                # 🔧 FIX: Kiểm tra lại trạng thái sau khi sleep
                if not self.is_open:
                    break
                
                order_id = next(self.order_counter)
                customer = random.choice(customer_names)
                coffee_type = random.choice(list(self.coffee_menu.keys()))
                size = random.choice(self.sizes)
                
                # Thêm yêu cầu đặc biệt ngẫu nhiên
                special_requests = random.sample(
                    self.special_options, 
                    random.randint(0, 2)
                )
                
                order = CoffeeOrder(
                    id=order_id,
                    customer_name=customer,
                    coffee_type=coffee_type,
                    size=size,
                    special_requests=special_requests,
                    status=OrderStatus.PLACED,
                    placed_at=datetime.now()
                )
                
                await self.order_queue.put(order)
                print(f"🆕 ĐƠN HÀNG #{order_id}: {customer} - {coffee_type} ({size})")
                if special_requests:
                    print(f"   💬 Yêu cầu: {', '.join(special_requests)}")
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"❌ Lỗi tạo đơn hàng: {e}")
        
        print("👥 ĐÃ DỪNG NHẬN ĐƠN HÀNG MỚI")

    async def brew_coffee(self, order: CoffeeOrder):
        """Mô phỏng pha chế cà phê bất đồng bộ"""
        coffee_info = self.coffee_menu[order.coffee_type]
        brew_time = random.uniform(*coffee_info["time"])
        
        print(f"🔥 Barista đang pha #{order.id}: {order.coffee_type} cho {order.customer_name}...")
        
        # Thêm thời gian cho yêu cầu đặc biệt
        if order.special_requests:
            brew_time += len(order.special_requests) * 0.5
        
        # Mô phỏng quá trình pha chế với các bước nhỏ
        steps = [
            "Xay hạt cà phê",
            "Chiết xuất espresso",
            "Hâm nóng sữa",
            "Tạo hình nghệ thuật",
            "Thêm topping"
        ]
        
        for step in steps[:random.randint(2, 5)]:
            try:
                await asyncio.sleep(brew_time / 5)
                # 🔧 FIX: Kiểm tra trạng thái quán
                if not self.is_open:
                    print(f"⏹️ Dừng pha chế #{order.id} (quán đóng cửa)")
                    return
                print(f"   👨‍🍳 #{order.id}: {step}...")
            except asyncio.CancelledError:
                print(f"⏹️ Hủy pha chế #{order.id}")
                return
        
        try:
            await asyncio.sleep(brew_time)
            print(f"✅ Đã pha xong #{order.id}: {order.coffee_type}")
        except asyncio.CancelledError:
            print(f"⏹️ Hủy pha chế #{order.id}")
            return

    async def prepare_additional_items(self, order: CoffeeOrder):
        """Mô phỏng chuẩn bị các món kèm theo bất đồng bộ"""
        if not order.special_requests:
            return
            
        print(f"🍯 Đang chuẩn bị phần kèm theo cho #{order.id}...")
        
        tasks = []
        for request in order.special_requests:
            if "đường" in request.lower():
                task = asyncio.create_task(self.add_sugar(order))
                tasks.append(task)
            elif "sữa" in request.lower():
                task = asyncio.create_task(self.add_milk(order))
                tasks.append(task)
            elif "syrup" in request.lower():
                task = asyncio.create_task(self.add_syrup(order))
                tasks.append(task)
        
        if tasks:
            try:
                await asyncio.gather(*tasks)
            except asyncio.CancelledError:
                print(f"⏹️ Hủy chuẩn bị phần kèm #{order.id}")

    async def add_sugar(self, order: CoffeeOrder):
        """Thêm đường"""
        try:
            await asyncio.sleep(0.5)
            print(f"   🍚 Đã thêm đường cho #{order.id}")
        except asyncio.CancelledError:
            return

    async def add_milk(self, order: CoffeeOrder):
        """Thêm sữa"""
        try:
            await asyncio.sleep(0.8)
            print(f"   🥛 Đã thêm sữa cho #{order.id}")
        except asyncio.CancelledError:
            return

    async def add_syrup(self, order: CoffeeOrder):
        """Thêm syrup"""
        try:
            await asyncio.sleep(1.0)
            print(f"   🍯 Đã thêm syrup cho #{order.id}")
        except asyncio.CancelledError:
            return

    async def serve_customer(self, order: CoffeeOrder):
        """Mô phỏng phục vụ khách hàng"""
        try:
            print(f"🔄 Đang phục vụ #{order.id} cho {order.customer_name}...")
            await asyncio.sleep(1.0)
            print(f"🎉 Đã phục vụ #{order.id}: {order.coffee_type} cho {order.customer_name}")
        except asyncio.CancelledError:
            print(f"⏹️ Hủy phục vụ #{order.id}")

    async def process_single_order(self, barista_id: int, order: CoffeeOrder):
        """Xử lý một đơn hàng cà phê với các bước bất đồng bộ"""
        try:
            print(f"\n🧑‍🍳 BARISTA #{barista_id} NHẬN ĐƠN #{order.id}")
            print(f"   👤 Khách: {order.customer_name}")
            print(f"   ☕ Đồ uống: {order.coffee_type} ({order.size})")
            
            # Cập nhật trạng thái
            order.status = OrderStatus.BREWING
            
            # Thực hiện các công việc bất đồng bộ song song
            brew_task = asyncio.create_task(self.brew_coffee(order))
            prep_task = asyncio.create_task(self.prepare_additional_items(order))
            
            # 🔧 FIX: Theo dõi các task
            self.active_tasks.add(brew_task)
            self.active_tasks.add(prep_task)
            
            # Chờ cả hai công việc hoàn thành
            try:
                await asyncio.gather(brew_task, prep_task)
            except asyncio.CancelledError:
                print(f"⏹️ Hủy xử lý đơn #{order.id}")
                return
            
            # Kiểm tra xem quán còn mở không
            if not self.is_open:
                print(f"⏹️ Dừng đơn #{order.id} (quán đóng cửa)")
                return
            
            # Phục vụ khách hàng
            order.status = OrderStatus.READY
            await self.serve_customer(order)
            
            # Hoàn thành đơn hàng
            order.status = OrderStatus.SERVED
            order.completed_at = datetime.now()
            self.completed_orders.append(order)
            
            # Tính thời gian xử lý
            processing_time = (order.completed_at - order.placed_at).total_seconds()
            print(f"⏱️ ĐƠN #{order.id} HOÀN THÀNH trong {processing_time:.1f}s")
            
        except Exception as e:
            print(f"❌ Lỗi xử lý đơn #{order.id}: {e}")
            order.status = OrderStatus.FAILED
            order.completed_at = datetime.now()
            self.completed_orders.append(order)
        finally:
            # Dọn dẹp tasks
            self.active_tasks.discard(brew_task)
            self.active_tasks.discard(prep_task)

    async def barista_worker(self, barista_id: int):
        """Worker của barista xử lý đơn hàng từ queue"""
        print(f"🧑‍🍳 Barista #{barista_id} đã sẵn sàng làm việc!")
        
        while self.is_open or not self.order_queue.empty():
            try:
                # Lấy đơn hàng từ queue với timeout ngắn hơn
                order = await asyncio.wait_for(self.order_queue.get(), timeout=1.0)
                
                # Xử lý đơn hàng
                await self.process_single_order(barista_id, order)
                
                # Đánh dấu task hoàn thành
                self.order_queue.task_done()
                
            except asyncio.TimeoutError:
                # Không có đơn hàng, tiếp tục chờ
                continue
            except asyncio.CancelledError:
                print(f"🧑‍🍳 Barista #{barista_id} ngừng làm việc")
                break
            except Exception as e:
                print(f"❌ Barista #{barista_id} gặp lỗi: {e}")
        
        print(f"🧑‍🍳 Barista #{barista_id} đã kết thúc ca làm")

    async def start_baristas(self, num_baristas: int = 3):
        """Khởi động các barista (workers)"""
        print(f"👥 TUYỂN DỤNG {num_baristas} BARISTA...")
        
        for i in range(num_baristas):
            barista = asyncio.create_task(self.barista_worker(i + 1))
            self.baristas.append(barista)
            await asyncio.sleep(0.5)  # Barista đến làm việc không cùng lúc

    async def display_live_stats(self):
        """Hiển thị thống kê trực tiếp của quán"""
        print("\n📊 BẬT BẢNG THỐNG KÊ TRỰC TUYẾN")
        
        while self.is_open:
            try:
                await asyncio.sleep(10)  # Cập nhật mỗi 10 giây
                
                current_time = datetime.now().strftime('%H:%M:%S')
                queue_size = self.order_queue.qsize()
                served_orders = len([o for o in self.completed_orders if o.status == OrderStatus.SERVED])
                failed_orders = len([o for o in self.completed_orders if o.status == OrderStatus.FAILED])
                
                print(f"\n📈 THỐNG KÊ QUÁN [{current_time}]")
                print(f"   📋 Đơn hàng đang chờ: {queue_size}")
                print(f"   ✅ Đơn đã phục vụ: {served_orders}")
                print(f"   ❌ Đơn thất bại: {failed_orders}")
                print(f"   🧑‍🍳 Số barista đang làm: {len(self.baristas)}")
                
                # Hiển thị 3 đơn hàng gần nhất
                recent_orders = sorted(self.completed_orders, key=lambda x: x.completed_at, reverse=True)[:3]
                if recent_orders:
                    print(f"   🕒 Đơn gần nhất: #{recent_orders[0].id} - {recent_orders[0].customer_name}")
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"❌ Lỗi thống kê: {e}")
        
        print("📊 ĐÃ TẮT THỐNG KÊ")

    async def run_coffee_shop_simulation(self, duration: int = 120):
        """Chạy mô phỏng quán cà phê"""
        print(f"🚀 BẮT ĐẦU MÔ PHỎNG QUÁN CÀ PHÊ ({duration} GIÂY)")
        print("=" * 50)
        
        # Khởi động các thành phần
        customer_task = asyncio.create_task(self.customer_arrival())
        await self.start_baristas(3)  # 3 baristas
        stats_task = asyncio.create_task(self.display_live_stats())
        
        # Chạy trong khoảng thời gian chỉ định
        print(f"\n⏰ Quán sẽ mở cửa trong {duration} giây...")
        try:
            await asyncio.sleep(duration)
        except asyncio.CancelledError:
            pass
        
        # Đóng cửa - FIX QUAN TRỌNG: Đóng cửa đúng cách
        print(f"\n🛑 ĐANG ĐÓNG CỬA QUÁN...")
        self.is_open = False
        
        # 🔧 FIX QUAN TRỌNG: Hủy task customer trước
        customer_task.cancel()
        try:
            await customer_task
        except asyncio.CancelledError:
            pass
        
        # 🔧 FIX: Đợi queue trống và các task hiện tại hoàn thành
        print("⏳ Đang chờ xử lý hết đơn hàng hiện tại...")
        try:
            await asyncio.wait_for(self.order_queue.join(), timeout=10.0)
        except asyncio.TimeoutError:
            print("⚠️ Timeout khi chờ queue trống, tiếp tục đóng cửa...")
        
        # 🔧 FIX: Hủy các barista
        print("🧑‍🍳 Đang yêu cầu barista kết thúc ca làm...")
        for barista in self.baristas:
            barista.cancel()
        
        # 🔧 FIX: Đợi các barista kết thúc
        try:
            await asyncio.gather(*self.baristas, return_exceptions=True)
        except:
            pass
        
        # Hủy stats task
        stats_task.cancel()
        try:
            await stats_task
        except asyncio.CancelledError:
            pass
        
        # 🔧 FIX: Hủy tất cả active tasks còn lại
        for task in self.active_tasks:
            task.cancel()
        try:
            await asyncio.gather(*self.active_tasks, return_exceptions=True)
        except:
            pass
        
        # Hiển thị báo cáo cuối
        await self.generate_final_report()

    async def generate_final_report(self):
        """Tạo báo cáo tổng kết"""
        print("\n" + "=" * 60)
        print("📊 BÁO CÁO TỔNG KẾT QUÁN CÀ PHÊ")
        print("=" * 60)
        
        total_orders = len(self.completed_orders)
        served_orders = len([o for o in self.completed_orders if o.status == OrderStatus.SERVED])
        failed_orders = len([o for o in self.completed_orders if o.status == OrderStatus.FAILED])
        
        if total_orders > 0:
            success_rate = (served_orders / total_orders) * 100
            
            # Tính thời gian phục vụ trung bình
            serve_times = []
            coffee_stats = {}
            
            for order in self.completed_orders:
                if order.completed_at and order.status == OrderStatus.SERVED:
                    serve_time = (order.completed_at - order.placed_at).total_seconds()
                    serve_times.append(serve_time)
                    
                    # Thống kê loại cà phê
                    if order.coffee_type not in coffee_stats:
                        coffee_stats[order.coffee_type] = 0
                    coffee_stats[order.coffee_type] += 1
            
            avg_serve_time = sum(serve_times) / len(serve_times) if serve_times else 0
            
            print(f"📈 TỔNG SỐ ĐƠN HÀNG: {total_orders}")
            print(f"✅ ĐƠN THÀNH CÔNG: {served_orders}")
            print(f"❌ ĐƠN THẤT BẠI: {failed_orders}")
            print(f"🎯 TỶ LỆ THÀNH CÔNG: {success_rate:.1f}%")
            print(f"⏱️ Thời gian phục vụ trung bình: {avg_serve_time:.1f}s")
            
            # Top 3 đồ uống phổ biến
            print(f"\n🏆 TOP ĐỒ UỐNG PHỔ BIẾN:")
            popular_drinks = sorted(coffee_stats.items(), key=lambda x: x[1], reverse=True)[:3]
            for drink, count in popular_drinks:
                print(f"   ☕ {drink}: {count} đơn")
        
        else:
            print("📭 Không có đơn hàng nào được phục vụ")
        
        print("\n🎉 KẾT THÚC MÔ PHỎNG QUÁN CÀ PHÊ BẤT ĐỒNG BỘ")

async def main():
    """Hàm chính"""
    coffee_shop = AsyncCoffeeShop()
    
    try:
        await coffee_shop.run_coffee_shop_simulation(duration=120)  # 2 phút
    except KeyboardInterrupt:
        print("\n\n🛑 Dừng mô phỏng theo yêu cầu...")
        coffee_shop.is_open = False
        await coffee_shop.generate_final_report()
    except Exception as e:
        print(f"\n💥 Lỗi không mong muốn: {e}")
        coffee_shop.is_open = False
        await coffee_shop.generate_final_report()

if __name__ == "__main__":
    print("🎯 ỨNG DỤNG MÔ PHỎNG QUÁN CÀ PHÊ BẤT ĐỒNG BỘ")
    print("Môn: Lập trình Mạng - Elearning-3")
    print("Minh họa kỹ thuật bất đồng bộ trong thực tế")
    print()
    
    asyncio.run(main())
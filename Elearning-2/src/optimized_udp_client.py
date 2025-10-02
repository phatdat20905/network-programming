import socket
import time
import json
import threading
import asyncio
from typing import Dict, List
from dataclasses import dataclass

@dataclass
class SentMessage:
    seq: int
    content: str
    timestamp: float
    retries: int = 0
    acked: bool = False

class OptimizedUDPClient:
    def __init__(self, server_host='localhost', server_port=8888):
        self.server_addr = (server_host, server_port)
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.settimeout(1.0)
        
        # Quản lý messages chưa được ACK
        self.unacked_messages: Dict[int, SentMessage] = {}
        self.sequence_num = 0
        self.bundle_size = 3
        
        # Thống kê
        self.stats = {
            'messages_sent': 0,
            'messages_acked': 0,
            'retransmissions': 0,
            'bundles_sent': 0,
            'rtt_samples': []
        }
        
        # Lock cho thread safety
        self.lock = threading.Lock()
        
        # 🔧 FIX: Biến điều khiển thread
        self.listening_active = True
        
        print(f"🔗 UDP Client kết nối đến {server_host}:{server_port}")
        print("⚡ Kỹ thuật: Smart Bundling + Selective Retransmission")
        print("=" * 50)

    def send_bundle(self, messages: List[SentMessage]):
        """Gửi một bundle messages đến server"""
        bundle_data = {
            'type': 'bundle',
            'messages': [{'seq': msg.seq, 'content': msg.content} for msg in messages]
        }
        
        data = json.dumps(bundle_data).encode()
        
        with self.lock:
            self.socket.sendto(data, self.server_addr)
            self.stats['bundles_sent'] += 1
            self.stats['messages_sent'] += len(messages)
            
            # Lưu trữ messages chờ ACK
            for msg in messages:
                self.unacked_messages[msg.seq] = msg
                self.setup_retransmission(msg)
            
            seq_list = [msg.seq for msg in messages]
            print(f"📤 SENT bundle: {len(messages)} messages (seq: {seq_list})")

    def setup_retransmission(self, message: SentMessage):
        """Thiết lập cơ chế gửi lại cho message"""
        def retransmit():
            time.sleep(1.0)  # Timeout 1 giây
            
            with self.lock:
                # 🔧 FIX: Kiểm tra client còn active không
                if not self.listening_active or message.seq not in self.unacked_messages:
                    return
                    
                if message.retries >= 3:  # Giới hạn số lần gửi lại
                    print(f"💥 DROP seq={message.seq} (đạt max retries)")
                    del self.unacked_messages[message.seq]
                    return
                
                message.retries += 1
                self.stats['retransmissions'] += 1
                
                # Selective retransmission - chỉ gửi message bị mất
                retry_data = {
                    'type': 'single',
                    'message': {'seq': message.seq, 'content': message.content}
                }
                
                print(f"🔄 RETRANSMIT seq={message.seq} (lần {message.retries})")
                
                # 🔧 FIX: Kiểm tra socket còn valid không
                try:
                    self.socket.sendto(json.dumps(retry_data).encode(), self.server_addr)
                except OSError:
                    return  # Socket đã bị đóng
                
                # Tiếp tục theo dõi cho lần retry tiếp theo
                if self.listening_active and message.retries < 3:
                    threading.Timer(1.0, retransmit).start()
        
        # 🔧 FIX: Chỉ schedule retransmission nếu client còn active
        if self.listening_active:
            threading.Timer(1.0, retransmit).start()

    def listen_for_acks(self):
        """Lắng nghe ACK từ server - ĐÃ FIX LỖI SOCKET"""
        while self.listening_active:
            try:
                data, _ = self.socket.recvfrom(65535)
                ack_data = json.loads(data.decode())
                
                if ack_data['type'] == 'ack':
                    seq_num = ack_data['seq']
                    
                    with self.lock:
                        if seq_num in self.unacked_messages:
                            message = self.unacked_messages[seq_num]
                            rtt = time.time() - message.timestamp
                            self.stats['rtt_samples'].append(rtt)
                            
                            del self.unacked_messages[seq_num]
                            self.stats['messages_acked'] += 1
                            
                            print(f"✅ ACK seq={seq_num} (RTT: {rtt:.3f}s)")
                            
            except socket.timeout:
                continue
            except json.JSONDecodeError as e:
                if self.listening_active:
                    print(f"❌ Lỗi decode ACK: {e}")
            except OSError as e:
                # 🔧 FIX: Chỉ in lỗi khi client còn active và không phải lỗi "not a socket"
                if self.listening_active and e.winerror != 10038:
                    print(f"❌ Lỗi socket: {e}")
            except Exception as e:
                if self.listening_active:
                    print(f"❌ Lỗi nhận ACK: {e}")

    async def send_messages(self, messages_content: List[str]):
        """Gửi danh sách messages với kỹ thuật bundling"""
        message_queue: List[SentMessage] = []
        
        for content in messages_content:
            message = SentMessage(
                seq=self.sequence_num,
                content=content,
                timestamp=time.time()
            )
            self.sequence_num += 1
            message_queue.append(message)
            
            # Gửi khi đủ bundle size
            if len(message_queue) >= self.bundle_size:
                self.send_bundle(message_queue)
                message_queue = []
                await asyncio.sleep(0.2)  # Rate limiting
        
        # Gửi các messages còn lại
        if message_queue:
            self.send_bundle(message_queue)

    def print_stats(self):
        """In thống kê hiệu suất"""
        print("\n" + "="*50)
        print("📊 CLIENT STATISTICS")
        print("="*50)
        print(f"📤 Messages Sent: {self.stats['messages_sent']}")
        print(f"✅ Messages ACKed: {self.stats['messages_acked']}")
        print(f"🔄 Retransmissions: {self.stats['retransmissions']}")
        print(f"📦 Bundles Sent: {self.stats['bundles_sent']}")
        
        if self.stats['rtt_samples']:
            avg_rtt = sum(self.stats['rtt_samples']) / len(self.stats['rtt_samples'])
            print(f"⏱️ Average RTT: {avg_rtt:.3f}s")
        
        if self.stats['messages_sent'] > 0:
            success_rate = (self.stats['messages_acked'] / self.stats['messages_sent']) * 100
            print(f"🎯 Success Rate: {success_rate:.1f}%")
        
        with self.lock:
            pending = len(self.unacked_messages)
            print(f"⏳ Pending ACKs: {pending}")
            
            if pending > 0:
                print("❌ Unacked messages:", list(self.unacked_messages.keys()))

    def start_demo(self):
        """Chạy demo client - ĐÃ FIX HOÀN TOÀN"""
        # Bắt đầu lắng nghe ACK
        ack_thread = threading.Thread(target=self.listen_for_acks, daemon=True)
        ack_thread.start()
        
        # Demo messages
        demo_messages = [
            "Hello UDP Optimization",
            "Packet với bundling technique",
            "Selective retransmission demo",
            "Message quan trọng số 1",
            "Message quan trọng số 2", 
            "Message quan trọng số 3",
            "Kiểm tra loss handling",
            "Tin nhắn cuối cùng trong demo"
        ]
        
        print("\n🧪 Starting UDP Optimization Demo...")
        print(f"💡 Sẽ gửi {len(demo_messages)} messages với bundle size {self.bundle_size}")
        
        try:
            # Gửi messages
            asyncio.run(self.send_messages(demo_messages))
            
            # Chờ kết quả
            print("\n⏳ Đợi kết quả từ server...")
            time.sleep(8)
            
        finally:
            # 🔧 FIX: Luôn dừng thread và đóng socket
            self.listening_active = False
            
            # Đợi thread kết thúc
            time.sleep(0.1)
            
            # Đóng socket
            try:
                self.socket.close()
            except:
                pass
        
        # In thống kê cuối cùng
        self.print_stats()
        
        if len(self.unacked_messages) == 0:
            print("\n🎉 Tất cả messages đã được xác nhận!")
        else:
            print(f"\n⚠️  Còn {len(self.unacked_messages)} messages chưa được xác nhận")

if __name__ == "__main__":
    client = OptimizedUDPClient()
    client.start_demo()
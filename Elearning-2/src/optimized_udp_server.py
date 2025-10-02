import socket
import time
import json
import random
from typing import Dict, Set
import threading

class OptimizedUDPServer:
    def __init__(self, host='localhost', port=8888):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind((host, port))
        
        # Data structures tối ưu
        self.expected_seq: Dict[str, int] = {}
        self.processed_seqs: Dict[str, Set[int]] = {}
        
        # Statistics
        self.stats = {
            'total_packets': 0,
            'bundles_received': 0,
            'messages_processed': 0,
            'duplicates_dropped': 0,
            'acks_sent': 0,
            'packets_lost': 0
        }
        
        print(f"🚀 Optimized UDP Server tại {host}:{port}")
        print("⚡ Kỹ thuật: Bundling + Selective ACK + Loss Handling")
        print("=" * 50)

    def get_client_key(self, address):
        return f"{address[0]}:{address[1]}"

    def simulate_packet_loss(self, probability=0.3):
        """Mô phỏng mất gói tin với xác suất 30%"""
        return random.random() < probability

    def send_ack(self, seq_num: int, address):
        """Gửi ACK cho client"""
        ack = json.dumps({'type': 'ack', 'seq': seq_num})
        self.socket.sendto(ack.encode(), address)
        self.stats['acks_sent'] += 1

    def handle_bundle(self, bundle_data: dict, address):
        """Xử lý bundle messages từ client"""
        client_key = self.get_client_key(address)
        
        # Khởi tạo state cho client mới
        if client_key not in self.expected_seq:
            self.expected_seq[client_key] = 0
            self.processed_seqs[client_key] = set()
        
        expected = self.expected_seq[client_key]
        processed_seqs = self.processed_seqs[client_key]
        
        print(f"📦 Bundle từ {client_key}: {len(bundle_data['messages'])} messages")
        
        processed_count = 0
        for message in bundle_data['messages']:
            seq_num = message['seq']
            
            # Mô phỏng mất gói tin
            if self.simulate_packet_loss():
                print(f"🚨 MẤT seq={seq_num}")
                self.stats['packets_lost'] += 1
                continue
            
            # Kiểm tra duplicate
            if seq_num in processed_seqs:
                print(f"🔄 DUPLICATE seq={seq_num}, bỏ qua")
                self.stats['duplicates_dropped'] += 1
                continue
            
            # Xử lý theo thứ tự sequence number
            if seq_num == expected:
                print(f"✅ PROCESS seq={seq_num}: {message['content']}")
                processed_seqs.add(seq_num)
                self.expected_seq[client_key] += 1
                processed_count += 1
                self.send_ack(seq_num, address)
                
                # Xử lý các sequence number đang chờ
                self.process_buffered(client_key, address)
            else:
                # Lưu các sequence number lớn hơn expected
                if seq_num > expected:
                    processed_seqs.add(seq_num)
                    print(f"⏳ BUFFER seq={seq_num} (waiting {expected})")
        
        self.stats['messages_processed'] += processed_count
        return processed_count

    def process_buffered(self, client_key: str, address):
        """Xử lý các sequence number đang chờ trong buffer"""
        expected = self.expected_seq[client_key]
        processed_seqs = self.processed_seqs[client_key]
        
        # Xử lý tuần tự các sequence number đã nhận
        while expected in processed_seqs:
            print(f"📦 PROCESS BUFFERED seq={expected}")
            self.send_ack(expected, address)
            expected += 1
        
        self.expected_seq[client_key] = expected

    def print_stats(self):
        """In thống kê hiệu suất"""
        print("\n" + "="*50)
        print("📊 SERVER STATISTICS")
        print("="*50)
        print(f"📨 Total Packets: {self.stats['total_packets']}")
        print(f"📦 Bundles Received: {self.stats['bundles_received']}")
        print(f"✅ Messages Processed: {self.stats['messages_processed']}")
        print(f"📤 ACKs Sent: {self.stats['acks_sent']}")
        print(f"🚨 Packets Lost: {self.stats['packets_lost']}")
        print(f"🔄 Duplicates Dropped: {self.stats['duplicates_dropped']}")
        print(f"👥 Active Clients: {len(self.expected_seq)}")

    def start(self):
        """Khởi động UDP server"""
        print("🔄 Server đang lắng nghe...")
        print("💡 Nhấn Ctrl+C để dừng server\n")
        
        # Thread in thống kê định kỳ
        def stats_printer():
            while True:
                time.sleep(10)
                self.print_stats()
        
        stats_thread = threading.Thread(target=stats_printer, daemon=True)
        stats_thread.start()
        
        try:
            while True:
                data, address = self.socket.recvfrom(65535)
                self.stats['total_packets'] += 1
                
                try:
                    message_data = json.loads(data.decode())
                    
                    if message_data['type'] == 'bundle':
                        self.stats['bundles_received'] += 1
                        self.handle_bundle(message_data, address)
                    elif message_data['type'] == 'single':
                        # Xử lý message đơn lẻ (retransmission)
                        self.handle_single_message(message_data['message'], address)
                        
                except json.JSONDecodeError as e:
                    print(f"❌ Lỗi decode JSON: {e}")
                    
        except KeyboardInterrupt:
            print("\n🛑 Đang dừng server...")
            self.print_stats()
        finally:
            self.socket.close()

    def handle_single_message(self, message: dict, address):
        """Xử lý message đơn lẻ (cho retransmission)"""
        client_key = self.get_client_key(address)
        seq_num = message['seq']
        
        if client_key not in self.expected_seq:
            return
            
        processed_seqs = self.processed_seqs[client_key]
        
        if seq_num not in processed_seqs:
            print(f"🔁 RETRANSMITTED seq={seq_num}: {message['content']}")
            processed_seqs.add(seq_num)
            self.send_ack(seq_num, address)
            self.stats['messages_processed'] += 1

if __name__ == "__main__":
    server = OptimizedUDPServer()
    server.start()
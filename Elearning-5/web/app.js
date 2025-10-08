class ChatApplication {
    constructor() {
        this.ws = null;
        this.signalr = null;
        this.grpc = null;
        this.userId = 'User1';
        this.room = 'general';
        this.isGrpcConnected = false;
        
        this.initializeApp();
    }

    initializeApp() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.updateUI();
    }

    loadUserPreferences() {
        const savedUser = localStorage.getItem('chatUser');
        const savedRoom = localStorage.getItem('chatRoom');
        
        if (savedUser) this.userId = savedUser;
        if (savedRoom) this.room = savedRoom;
        
        document.getElementById('username').value = this.userId;
        document.getElementById('room').value = this.room;
    }

    setupEventListeners() {
        // Auto-connect on page load for demo
        setTimeout(() => {
            this.connectWebSocket();
        }, 1000);
    }

    connectWebSocket() {
        try {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.addSystemMessage('WebSocket already connected');
                return;
            }

            this.updateStatus('wsStatus', 'connecting', 'Connecting...');
            
            this.ws = new WebSocket('ws://localhost:8080/ws');
            
            this.ws.onopen = () => {
                this.updateStatus('wsStatus', 'connected', 'Connected');
                this.addSystemMessage('WebSocket connected successfully');
                
                // Send join message
                const joinMsg = {
                    user: this.userId,
                    message: `${this.userId} joined the chat`,
                    room: this.room,
                    type: 'join'
                };
                this.ws.send(JSON.stringify(joinMsg));
            };
            
            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.displayMessage(message);
            };
            
            this.ws.onclose = () => {
                this.updateStatus('wsStatus', 'disconnected', 'Disconnected');
                this.addSystemMessage('WebSocket disconnected');
            };
            
            this.ws.onerror = (error) => {
                this.updateStatus('wsStatus', 'disconnected', 'Error');
                this.addSystemMessage('WebSocket connection error: ' + error.message);
            };
            
        } catch (error) {
            this.addSystemMessage('Failed to connect WebSocket: ' + error.message);
            this.updateStatus('wsStatus', 'disconnected', 'Error');
        }
    }

    connectSignalR() {
        try {
            this.updateStatus('signalrStatus', 'connecting', 'Connecting...');
            
            // SignalR-like implementation
            this.signalr = new WebSocket('ws://localhost:8081/signalr');
            
            this.signalr.onopen = () => {
                this.updateStatus('signalrStatus', 'connected', 'Connected');
                this.addSystemMessage('SignalR-like connection established');
                
                // Send negotiation message
                const negotiateMsg = {
                    protocol: "json",
                    version: 1
                };
                this.signalr.send(JSON.stringify(negotiateMsg));
            };
            
            this.signalr.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.handleSignalRMessage(message);
            };
            
            this.signalr.onclose = () => {
                this.updateStatus('signalrStatus', 'disconnected', 'Disconnected');
                this.addSystemMessage('SignalR connection closed');
            };
            
            this.signalr.onerror = (error) => {
                this.updateStatus('signalrStatus', 'disconnected', 'Error');
                this.addSystemMessage('SignalR connection error');
            };
            
        } catch (error) {
            this.addSystemMessage('Failed to connect SignalR: ' + error.message);
            this.updateStatus('signalrStatus', 'disconnected', 'Error');
        }
    }

    connectGRPC() {
        this.updateStatus('grpcStatus', 'connecting', 'Connecting...');
        
        // For gRPC-Web implementation, we'd use a proper gRPC-Web client
        // This is a simplified demonstration
        setTimeout(() => {
            this.isGrpcConnected = true;
            this.updateStatus('grpcStatus', 'connected', 'Connected (Simulated)');
            this.addSystemMessage('gRPC connection simulated - use gRPC-Web for actual implementation');
        }, 1000);
    }

    handleSignalRMessage(message) {
        if (message.type === 1) { // Invocation
            this.addSystemMessage(`SignalR: ${message.target} invoked`);
        } else if (message.type === 6) { // Ping
            // Respond to ping
            const pong = { type: 6 };
            this.signalr.send(JSON.stringify(pong));
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const protocol = document.getElementById('protocolSelect').value;
        const message = messageInput.value.trim();
        
        if (!message) return;

        const messageData = {
            user: this.userId,
            message: message,
            room: this.room,
            timestamp: new Date().toISOString()
        };

        try {
            switch (protocol) {
                case 'websocket':
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify(messageData));
                        this.displayMessage({...messageData, type: 'message'});
                    } else {
                        this.addSystemMessage('WebSocket not connected');
                    }
                    break;
                    
                case 'signalr':
                    if (this.signalr && this.signalr.readyState === WebSocket.OPEN) {
                        const signalrMsg = {
                            type: 1, // Invocation
                            target: "SendMessage",
                            arguments: [this.userId, message, this.room]
                        };
                        this.signalr.send(JSON.stringify(signalrMsg));
                        this.displayMessage({...messageData, type: 'message'});
                    } else {
                        this.addSystemMessage('SignalR not connected');
                    }
                    break;
                    
                case 'grpc':
                    if (this.isGrpcConnected) {
                        this.addSystemMessage('gRPC message sending simulated');
                        this.displayMessage({...messageData, type: 'message'});
                    } else {
                        this.addSystemMessage('gRPC not connected');
                    }
                    break;
            }
            
            messageInput.value = '';
            
        } catch (error) {
            this.addSystemMessage('Failed to send message: ' + error.message);
        }
    }

    displayMessage(message) {
        const chat = document.getElementById('chat');
        const messageElement = document.createElement('div');
        
        messageElement.className = `message ${
            message.type === 'system' || message.user === 'System' ? 'system' :
            message.user === this.userId ? 'user' : 'other'
        }`;
        
        const time = new Date(message.timestamp).toLocaleTimeString();
        
        let content = '';
        if (message.type === 'join' || message.type === 'leave') {
            content = `<em>${message.message}</em>`;
        } else {
            content = `
                <strong>${this.escapeHtml(message.user)}</strong>
                <span class="time">${time}</span>
                <div class="content">${this.escapeHtml(message.message)}</div>
            `;
        }
        
        messageElement.innerHTML = content;
        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
    }

    addSystemMessage(text) {
        this.displayMessage({
            user: 'System',
            message: text,
            timestamp: new Date().toISOString(),
            type: 'system'
        });
    }

    updateStatus(elementId, status, text) {
        const element = document.getElementById(elementId);
        element.className = `status ${status}`;
        element.textContent = text;
    }

    updateUserInfo() {
        const newUser = document.getElementById('username').value.trim();
        const newRoom = document.getElementById('room').value.trim();
        
        if (newUser) {
            this.userId = newUser;
            localStorage.setItem('chatUser', newUser);
        }
        
        if (newRoom) {
            this.room = newRoom;
            localStorage.setItem('chatRoom', newRoom);
        }
        
        this.addSystemMessage(`User info updated: ${this.userId} in room ${this.room}`);
    }

    disconnectAll() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        if (this.signalr) {
            this.signalr.close();
            this.signalr = null;
        }
        
        this.isGrpcConnected = false;
        this.updateStatus('grpcStatus', 'disconnected', 'Disconnected');
        
        this.addSystemMessage('All connections closed');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updateUI() {
        // Update any dynamic UI elements
    }
}

// Global functions for HTML onclick handlers
let chatApp;

function connectWebSocket() {
    if (!chatApp) chatApp = new ChatApplication();
    chatApp.connectWebSocket();
}

function connectSignalR() {
    if (!chatApp) chatApp = new ChatApplication();
    chatApp.connectSignalR();
}

function connectGRPC() {
    if (!chatApp) chatApp = new ChatApplication();
    chatApp.connectGRPC();
}

function sendMessage() {
    if (chatApp) chatApp.sendMessage();
}

function updateUserInfo() {
    if (chatApp) chatApp.updateUserInfo();
}

function disconnectAll() {
    if (chatApp) chatApp.disconnectAll();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize app when page loads
window.addEventListener('load', () => {
    chatApp = new ChatApplication();
});
// client/src/Chat.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

const Chat = ({ username }) => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]); // For Global Chat
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const chatEndRef = useRef(null); // For scrolling

    const logMessage = useCallback((msgData) => {
        setChatLog((prev) => [...prev, msgData]);
    }, []);

    // Scroll to bottom whenever chatLog updates
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
            socket.emit('join_chat', username);
        });

        // --- Global Chat Listeners (Task 2 & 5) ---
        socket.on('receive_message', (data) => {
            logMessage({ type: 'message', content: data, id: data.id, status: 'received' });
        });
        
        // --- Private Chat Listener (Task 3) ---
        socket.on('receive_private_message', (data) => {
            const displaySender = data.isSender ? `To ${data.recipient}` : data.sender;
            logMessage({ 
                type: 'private_message', 
                content: { ...data, displaySender }, 
                id: Date.now() 
            });
            // You should implement dedicated state/UI for private messages
            alert(`New Private Message from ${data.sender}!`); 
        });

        // --- Status Listeners (Task 2 & 4) ---
        socket.on('user_joined', (data) => {
            logMessage({ type: 'notification', content: data.message });
            setOnlineUsers(data.users.filter(u => u !== username)); // Exclude self
        });
        socket.on('user_left', (data) => {
            logMessage({ type: 'notification', content: data.message });
            setOnlineUsers(data.users.filter(u => u !== username)); // Exclude self
        });
        socket.on('online_users', (users) => {
            setOnlineUsers(users.filter(u => u !== username)); // Exclude self
        });
        socket.on('user_typing', (typerUsername) => {
            setTypingUser(typerUsername);
            setTimeout(() => setTypingUser(null), 3000); 
        });
        socket.on('user_offline', (msg) => {
            alert(msg);
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('receive_private_message');
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('online_users');
            socket.off('user_typing');
            socket.off('user_offline');
        };
    }, [username, logMessage]);

    // Task 5: Send Message with Acknowledgement
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const messageData = {
                message: message.trim(),
                username: username,
            };
            
            const tempId = Date.now();
            // Add pending message to log
            setChatLog((prev) => [...prev, { type: 'message', content: { ...messageData, timestamp: new Date().toLocaleTimeString() }, id: tempId, status: 'sending...' }]);

            socket.emit('send_message', messageData, (response) => {
                // Update message status from 'sending...' to 'Delivered'
                setChatLog((prev) => 
                    prev.map(msg => 
                        msg.id === tempId 
                            ? { ...msg, id: response.messageId, status: 'Delivered', content: { ...msg.content, timestamp: new Date().toLocaleTimeString() } } 
                            : msg
                    )
                );
            });
            setMessage('');
        }
    };
    
    // Task 2: Typing indicator handler
    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (e.target.value.length > 0) {
            socket.emit('typing', username);
        }
    };
    
    // Example Private Message function (Task 3)
    const startPrivateChat = (recipient) => {
        const text = prompt(`Send a private message to ${recipient}:`);
        if (text) {
            const privateMessageData = {
                sender: username,
                recipient: recipient,
                message: text,
            };
            socket.emit('send_private_message', privateMessageData);
        }
    };


    return (
        <div className="chat-interface">
            <h2>Chatting as: {username}</h2>
            <div className="online-users-list">
                <h3>Online Users: ({onlineUsers.length})</h3>
                {onlineUsers.map((user) => (
                    <button key={user} onClick={() => startPrivateChat(user)} disabled={user === username}>
                        {user} (PM)
                    </button>
                ))}
            </div>

            <div className="chat-log-display">
                {chatLog.map((item) => (
                    <div key={item.id} className={`message-item ${item.type}`}>
                        {item.type === 'notification' && 
                            <p style={{fontStyle: 'italic'}}>--- {item.content} ---</p>}
                        
                        {item.type === 'message' && 
                            <p>
                                <strong>[{item.content.timestamp}] {item.content.username}:</strong> {item.content.message}
                                <small> ({item.status})</small>
                            </p>}
                            
                        {item.type === 'private_message' && 
                            <p style={{color: 'purple'}}>
                                <strong>[PM {item.content.timestamp}] {item.content.displaySender}:</strong> {item.content.message}
                            </p>}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            
            {typingUser && typingUser !== username && (
                <div className="typing-indicator">**{typingUser}** is typing...</div>
            )}

            <form onSubmit={sendMessage}>
                <input 
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder="Type your global message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
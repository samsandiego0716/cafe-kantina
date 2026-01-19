"use client";

import { useState, useEffect, useRef } from 'react';
import { subscribeToAllConversations, subscribeToConversation, sendMessage, markMessagesAsRead } from '@/lib/chat-service';
import { Send, User, Clock } from 'lucide-react';
import styles from './AdminChatPanel.module.css';

export default function AdminChatPanel() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);

    // Subscribe to all conversations
    useEffect(() => {
        const unsubscribe = subscribeToAllConversations((convs) => {
            setConversations(convs);
            // Auto-select first conversation if none selected
            if (!selectedConversationId && convs.length > 0) {
                setSelectedConversationId(convs[0].id);
            }
        });

        return () => unsubscribe();
    }, [selectedConversationId]);

    // Subscribe to selected conversation messages
    useEffect(() => {
        if (!selectedConversationId) {
            setMessages([]);
            return;
        }

        const unsubscribe = subscribeToConversation(selectedConversationId, (msgs) => {
            setMessages(msgs);
            // Mark as read when admin views the conversation
            markMessagesAsRead(selectedConversationId, true);
        });

        return () => unsubscribe();
    }, [selectedConversationId]);

    // Auto-scroll to bottom (only scrolls the messages container, not the page)
    useEffect(() => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || sending || !selectedConversationId) return;

        setSending(true);
        try {
            await sendMessage(
                selectedConversationId,
                inputText.trim(),
                'admin',
                'Admin',
                true // is admin
            );
            setInputText('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Customer Support Chat</h2>

            <div className={styles.chatPanel}>
                {/* Conversations List */}
                <div className={styles.conversationsList}>
                    <div className={styles.listHeader}>
                        <h3>Conversations</h3>
                        <span className={styles.count}>{conversations.length}</span>
                    </div>

                    {conversations.length === 0 ? (
                        <div className={styles.emptyList}>
                            <p>No conversations yet</p>
                            <p className={styles.helpText}>Customers will appear here when they start a chat</p>
                        </div>
                    ) : (
                        <div className={styles.conversationsScroll}>
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`${styles.conversationItem} ${selectedConversationId === conv.id ? styles.selected : ''
                                        }`}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                >
                                    <div className={styles.conversationHeader}>
                                        <div className={styles.userInfo}>
                                            <User size={16} />
                                            <span className={styles.userName}>{conv.userName}</span>
                                        </div>
                                        {conv.unreadByAdmin > 0 && (
                                            <span className={styles.unreadBadge}>
                                                {conv.unreadByAdmin}
                                            </span>
                                        )}
                                    </div>
                                    <p className={styles.lastMessage}>
                                        {conv.lastMessage || 'No messages yet'}
                                    </p>
                                    <div className={styles.conversationTime}>
                                        <Clock size={12} />
                                        <span>{formatTime(conv.lastMessageTime)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Messages */}
                <div className={styles.chatArea}>
                    {selectedConversation ? (
                        <>
                            <div className={styles.chatHeader}>
                                <div className={styles.customerInfo}>
                                    <User size={20} />
                                    <div>
                                        <h3>{selectedConversation.userName}</h3>
                                        <p className={styles.customerId}>User ID: {selectedConversation.userId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.messagesArea} ref={messagesAreaRef}>
                                {messages.length === 0 ? (
                                    <div className={styles.emptyMessages}>
                                        <p>No messages in this conversation</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`${styles.message} ${message.isAdmin ? styles.adminMessage : styles.userMessage
                                                }`}
                                        >
                                            <div className={styles.messageBubble}>
                                                <div className={styles.messageSender}>
                                                    {message.isAdmin ? 'You' : message.senderName}
                                                </div>
                                                <p className={styles.messageText}>{message.text}</p>
                                                <span className={styles.messageTime}>
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className={styles.messageInput}>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className={styles.input}
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    className={styles.sendButton}
                                    disabled={!inputText.trim() || sending}
                                    aria-label="Send message"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.noSelection}>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

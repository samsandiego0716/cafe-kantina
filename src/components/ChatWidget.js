"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, subscribeToConversation, markMessagesAsRead } from '@/lib/chat-service';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';
import styles from './ChatWidget.module.css';

export default function ChatWidget({ conversationId, onClose, onNewMessage }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);

    // Subscribe to messages
    useEffect(() => {
        if (!conversationId) return;

        const unsubscribe = subscribeToConversation(conversationId, (newMessages) => {
            setMessages(newMessages);
            // Mark messages as read when receiving new ones
            markMessagesAsRead(conversationId, false);
            if (onNewMessage) onNewMessage();
        });

        return () => unsubscribe();
    }, [conversationId, onNewMessage]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(
                conversationId,
                inputText.trim(),
                user.id,
                user.name,
                false // not admin
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
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`${styles.chatWidget} ${isMinimized ? styles.minimized : ''}`}>
            <div className={styles.chatHeader}>
                <div className={styles.headerTitle}>
                    <span className={styles.statusDot}></span>
                    <h3>Customer Support</h3>
                </div>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className={styles.iconButton}
                        aria-label={isMinimized ? "Maximize" : "Minimize"}
                    >
                        {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                    </button>
                    <button
                        onClick={onClose}
                        className={styles.iconButton}
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className={styles.chatMessages}>
                        {messages.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>👋 Hello! How can we help you today?</p>
                                <p className={styles.helpText}>Send us a message and we'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`${styles.message} ${message.isAdmin ? styles.adminMessage : styles.userMessage
                                        }`}
                                >
                                    <div className={styles.messageBubble}>
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

                    <form onSubmit={handleSend} className={styles.chatInput}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
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
            )}
        </div>
    );
}

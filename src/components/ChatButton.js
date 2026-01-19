"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { getOrCreateConversation, getUnreadCount } from '@/lib/chat-service';
import { MessageCircle } from 'lucide-react';
import styles from './ChatButton.module.css';
import ChatWidget from './ChatWidget';

export default function ChatButton() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [conversationId, setConversationId] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Don't show chat button if user is not logged in or on admin page
    if (!user || pathname?.startsWith('/admin')) {
        return null;
    }

    const toggleChat = async () => {
        // If opening chat and no conversation exists yet, create it
        if (!isOpen && !conversationId && user && user.id) {
            setIsInitializing(true);
            try {
                const convId = await getOrCreateConversation(user.id, user.name);
                setConversationId(convId);

                // Get unread count for existing conversation
                const count = await getUnreadCount(convId, false);
                setUnreadCount(count);
            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                setIsInitializing(false);
            }
        }

        setIsOpen(!isOpen);

        if (!isOpen) {
            // Reset unread count when opening chat
            setUnreadCount(0);
        }
    };

    return (
        <>
            <button
                className={styles.chatButton}
                onClick={toggleChat}
                aria-label="Customer Support Chat"
            >
                <MessageCircle size={24} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount}</span>
                )}
            </button>

            {isOpen && conversationId && (
                <ChatWidget
                    conversationId={conversationId}
                    onClose={() => setIsOpen(false)}
                    onNewMessage={() => setUnreadCount(0)}
                />
            )}
        </>
    );
}

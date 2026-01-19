import { db } from './firebase';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

/**
 * Creates or gets an existing conversation for a user
 * @param {string} userId - User ID
 * @param {string} userName - User's display name
 * @returns {Promise<string>} - Conversation ID
 */
export async function getOrCreateConversation(userId, userName) {
    try {
        const conversationsRef = collection(db, "conversations");
        const q = query(conversationsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return existing conversation
            return querySnapshot.docs[0].id;
        }

        // Create new conversation
        const newConversation = {
            userId,
            userName,
            createdAt: new Date().toISOString(),
            lastMessage: "",
            lastMessageTime: new Date().toISOString(),
            unreadByAdmin: 0,
            unreadByUser: 0,
            status: "active"
        };

        const docRef = await addDoc(conversationsRef, newConversation);
        return docRef.id;
    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        throw error;
    }
}

/**
 * Sends a message in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} text - Message text
 * @param {string} senderId - Sender's ID
 * @param {string} senderName - Sender's name
 * @param {boolean} isAdmin - Whether sender is admin
 */
export async function sendMessage(conversationId, text, senderId, senderName, isAdmin = false) {
    try {
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const message = {
            text,
            senderId,
            senderName,
            isAdmin,
            timestamp: new Date().toISOString(),
            read: false
        };

        await addDoc(messagesRef, message);

        // Update conversation metadata
        const conversationRef = doc(db, "conversations", conversationId);
        const updateData = {
            lastMessage: text,
            lastMessageTime: new Date().toISOString()
        };

        if (isAdmin) {
            updateData.unreadByUser = await getUnreadCount(conversationId, false) + 1;
        } else {
            updateData.unreadByAdmin = await getUnreadCount(conversationId, true) + 1;
        }

        await updateDoc(conversationRef, updateData);

        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * Subscribe to messages in a conversation (real-time)
 * @param {string} conversationId - Conversation ID
 * @param {function} callback - Callback function to receive messages
 * @returns {function} - Unsubscribe function
 */
export function subscribeToConversation(conversationId, callback) {
    try {
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            callback(messages);
        }, (error) => {
            console.error('Error listening to messages:', error);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error subscribing to conversation:', error);
        return () => { };
    }
}

/**
 * Subscribe to all conversations (for admin panel)
 * @param {function} callback - Callback function to receive conversations
 * @returns {function} - Unsubscribe function
 */
export function subscribeToAllConversations(callback) {
    try {
        const conversationsRef = collection(db, "conversations");
        const q = query(conversationsRef, orderBy("lastMessageTime", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const conversations = [];
            snapshot.forEach((doc) => {
                conversations.push({ id: doc.id, ...doc.data() });
            });
            callback(conversations);
        }, (error) => {
            console.error('Error listening to conversations:', error);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error subscribing to conversations:', error);
        return () => { };
    }
}

/**
 * Mark messages as read
 * @param {string} conversationId - Conversation ID
 * @param {boolean} isAdmin - Whether the reader is admin
 */
export async function markMessagesAsRead(conversationId, isAdmin) {
    try {
        const conversationRef = doc(db, "conversations", conversationId);
        const updateData = isAdmin
            ? { unreadByAdmin: 0 }
            : { unreadByUser: 0 };

        await updateDoc(conversationRef, updateData);
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
}

/**
 * Get unread message count
 * @param {string} conversationId - Conversation ID
 * @param {boolean} isAdmin - Whether checking for admin or user
 * @returns {Promise<number>} - Unread count
 */
export async function getUnreadCount(conversationId, isAdmin) {
    try {
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (conversationSnap.exists()) {
            const data = conversationSnap.data();
            return isAdmin ? (data.unreadByAdmin || 0) : (data.unreadByUser || 0);
        }

        return 0;
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
}

/**
 * Delete old conversations (older than 7 days)
 * This should be called periodically (e.g., via a scheduled function)
 */
export async function deleteOldConversations() {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const conversationsRef = collection(db, "conversations");
        const q = query(
            conversationsRef,
            where("lastMessageTime", "<", sevenDaysAgo.toISOString())
        );

        const querySnapshot = await getDocs(q);
        const deletePromises = [];

        querySnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });

        await Promise.all(deletePromises);
        console.log(`Deleted ${deletePromises.length} old conversations`);
    } catch (error) {
        console.error('Error deleting old conversations:', error);
        throw error;
    }
}

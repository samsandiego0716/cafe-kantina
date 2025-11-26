import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where, getDoc, onSnapshot } from 'firebase/firestore';

export async function getProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

export async function getOrders() {
    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error('Error reading orders:', error);
        return [];
    }
}

export async function getUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
}

export async function saveOrder(order) {
    try {
        const newOrder = {
            createdAt: new Date().toISOString(),
            status: 'Pending',
            ...order,
        };
        const docRef = await addDoc(collection(db, "orders"), newOrder);
        return { id: docRef.id, ...newOrder };
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}

export async function updateOrderStatus(orderId, status) {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status });
        return { id: orderId, status };
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

export async function registerUser(userData) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", userData.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("Email already registered");
        }

        const newUser = {
            createdAt: new Date().toISOString(),
            ...userData,
        };

        const docRef = await addDoc(usersRef, newUser);

        const { password, ...userWithoutPassword } = newUser;
        return { id: docRef.id, ...userWithoutPassword };
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export async function loginUser(email, password) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const { password: _, ...userWithoutPassword } = userData;
        return { id: userDoc.id, ...userWithoutPassword };
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export async function saveProduct(productData) {
    try {
        const docRef = await addDoc(collection(db, "products"), productData);
        return { id: docRef.id, ...productData };
    } catch (error) {
        console.error('Error saving product:', error);
        throw error;
    }
}

export async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, "products", productId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function updateProduct(productId, productData) {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, productData);
        return { id: productId, ...productData };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export async function getStoreStatus() {
    try {
        const docRef = doc(db, "settings", "store");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Default to open if not set
            return { isOpen: true };
        }
    } catch (error) {
        console.error('Error reading store status:', error);
        return { isOpen: true };
    }
}

export async function updateStoreStatus(isOpen) {
    try {
        const docRef = doc(db, "settings", "store");
        await setDoc(docRef, { isOpen }, { merge: true });
        return { isOpen };
    } catch (error) {
        console.error('Error updating store status:', error);
        throw error;
    }
}

export async function getPendingOrdersCount(userPhone) {
    try {
        const ordersRef = collection(db, "orders");
        // Query for orders with status 'Pending' or 'Preparing' for this user
        const q = query(
            ordersRef,
            where("phone", "==", userPhone),
            where("status", "in", ["Pending", "Preparing"])
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting pending orders count:', error);
        return 0;
    }
}

export function subscribeToOrders(callback) {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        callback(orders);
    }, (error) => {
        console.error('Error listening to orders:', error);
    });

    return unsubscribe;
}

export function subscribeToUserOrders(userPhone, callback) {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("phone", "==", userPhone));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        callback(orders);
    }, (error) => {
        console.error('Error listening to user orders:', error);
    });

    return unsubscribe;
}

export function subscribeToPendingOrdersCount(userPhone, callback) {
    const ordersRef = collection(db, "orders");
    const q = query(
        ordersRef,
        where("phone", "==", userPhone),
        where("status", "in", ["Pending", "Preparing"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        callback(snapshot.size);
    }, (error) => {
        console.error('Error listening to pending orders count:', error);
    });

    return unsubscribe;
}

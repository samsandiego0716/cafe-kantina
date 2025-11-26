import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
    apiKey: "AIzaSyB7bmnIxV6Q36JPm76lpRfQfKDLXm9wKPo",
    authDomain: "cafe-kantina.firebaseapp.com",
    projectId: "cafe-kantina",
    storageBucket: "cafe-kantina.firebasestorage.app",
    messagingSenderId: "218154108868",
    appId: "1:218154108868:web:bbd222ee9edc60fa178691",
    measurementId: "G-RSFTNZJ5B4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dataDir = path.join(__dirname, '../data');

async function migrateCollection(collectionName, fileName) {
    try {
        const filePath = path.join(dataDir, fileName);
        const data = await fs.readFile(filePath, 'utf-8');
        const items = JSON.parse(data);

        console.log(`Migrating ${items.length} items to ${collectionName}...`);

        for (const item of items) {
            // Use item.id as document ID if available, otherwise auto-generate
            const docRef = item.id ? doc(db, collectionName, item.id.toString()) : doc(collection(db, collectionName));
            await setDoc(docRef, item);
        }

        console.log(`Successfully migrated ${collectionName}`);
    } catch (error) {
        console.error(`Error migrating ${collectionName}:`, error);
    }
}

async function migrate() {
    await migrateCollection('products', 'products.json');
    await migrateCollection('orders', 'orders.json');
    await migrateCollection('users', 'users.json');
    console.log('Migration complete!');
    process.exit(0);
}

migrate();

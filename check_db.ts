import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function checkOrders() {
  try {
    const q = collection(db, 'orders');
    const snap = await getDocs(q);
    console.log(`Total orders found in '${firebaseConfig.projectId}':`, snap.size);
    snap.forEach(doc => {
      console.log(`Order ID: ${doc.id}, Status: ${doc.data().status}`);
    });
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}

checkOrders();

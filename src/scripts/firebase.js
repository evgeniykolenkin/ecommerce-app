import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOXDys5ZF3VVDNNg4il1MgFY5tTxpKgE0",
  authDomain: "ecommerce-app-869b1.firebaseapp.com",
  projectId: "ecommerce-app-869b1",
  storageBucket: "ecommerce-app-869b1.appspot.com",
  messagingSenderId: "159311137942",
  appId: "1:159311137942:web:ff7a7a73e7426c42b786b7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function get() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().name}`);
  });
}

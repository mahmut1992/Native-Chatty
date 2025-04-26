import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9t_LWPelYhsXBN5DFM8CcHaiRmWbpz7k",
  authDomain: "chat-app-native-2d685.firebaseapp.com",
  projectId: "chat-app-native-2d685",
  storageBucket: "chat-app-native-2d685.firebasestorage.app",
  messagingSenderId: "1028762793806",
  appId: "1:1028762793806:web:ef5c1af0172ce47599d01f",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth };
export default db;

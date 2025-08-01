import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjMrypaaLSBefyV6C-1FDpZED5NnKzonw",
  authDomain: "etech-solution.firebaseapp.com",
  projectId: "etech-solution",
  storageBucket: "etech-solution.firebasestorage.app",
  messagingSenderId: "222998276801",
  appId: "1:222998276801:web:3a71226d316eb279ae4240",
  measurementId: "G-NQK3LM8CT0",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

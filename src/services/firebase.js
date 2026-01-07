import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDf5Xf90DupBCUCw6tyxlw6yvY6nVp3yaM",
  authDomain: "mdrp-54402.firebaseapp.com",
  projectId: "mdrp-54402",
  storageBucket: "mdrp-54402.firebasestorage.app",
  messagingSenderId: "1086250166416",
  appId: "1:1086250166416:web:d1223f678d79aa29579015",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

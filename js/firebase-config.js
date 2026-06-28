import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCrynvbEzjF7DIHa21ABcEU23IPmptvs3k",
  authDomain: "food-donation-connector-53143.firebaseapp.com",
  projectId: "food-donation-connector-53143",
  storageBucket: "food-donation-connector-53143.firebasestorage.app",
  messagingSenderId: "846770797051",
  appId: "1:846770797051:web:5b2590938c045bf4ac735e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// SIGNUP
async function handleSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // detect which role based on page
    let role = "";
    let name = "";
    if (window.location.pathname.includes("restaurant")) {
      role = "restaurant";
      name = document.getElementById("restaurantName").value;
    } else if (window.location.pathname.includes("ngo")) {
      role = "ngo";
      name = document.getElementById("ngoName").value;
    } else if (window.location.pathname.includes("volunteer")) {
      role = "volunteer";
      name = document.getElementById("fullName").value;
    }

    // save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: role,
      createdAt: new Date()
    });

    alert("Account created successfully!");

    // redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }
}

// LOGIN
async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}

// LOGOUT
async function handleLogout() {
  await signOut(auth);
  window.location.href = "../index.html";
}

window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
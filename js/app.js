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

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc as firestoreDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// POST FOOD
async function postFood() {
  const foodName = document.getElementById("foodName").value;
  const category = document.getElementById("category").value;
  const quantity = document.getElementById("quantity").value;
  const unit = document.getElementById("unit").value;
  const pickupAddress = document.getElementById("pickupAddress").value;
  const availableFrom = document.getElementById("availableFrom").value;
  const fromPeriod = document.getElementById("fromPeriod").value;
  const availableUntil = document.getElementById("availableUntil").value;
  const untilPeriod = document.getElementById("untilPeriod").value;
  const notes = document.getElementById("notes").value;

  if (!foodName || !category || !quantity || !pickupAddress) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first!");
      window.location.href = "login.html";
      return;
    }

    await addDoc(collection(db, "foodListings"), {
      foodName,
      category,
      quantity,
      unit,
      pickupAddress,
      availableFrom: availableFrom + " " + fromPeriod,
      availableUntil: availableUntil + " " + untilPeriod,
      notes,
      status: "available",
      restaurantId: user.uid,
      restaurantEmail: user.email,
      createdAt: new Date()
    });

    document.getElementById("successMsg").style.display = "block";
    setTimeout(() => {
      window.location.href = "my-donations.html";
    }, 2000);

  } catch (error) {
    alert(error.message);
  }
}

// CLAIM FOOD
async function claimFood(button, foodId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first!");
      return;
    }

    const card = button.closest(".food-listing-card");
    const foodName = card.querySelector("h4").textContent;

    await updateDoc(firestoreDoc(db, "foodListings", foodId), {
      status: "claimed",
      claimedBy: user.uid,
      claimedAt: new Date()
    });

    button.textContent = "✅ Claimed!";
    button.classList.add("claimed");
    button.disabled = true;

    alert(`✅ ${foodName} claimed successfully! Restaurant has been notified.`);

  } catch (error) {
    alert(error.message);
  }
}

window.postFood = postFood;
window.claimFood = claimFood;

// FETCH MY DONATIONS (Restaurant)
async function loadMyDonations() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    const list = document.getElementById("donationsList");
    if (!list) return;

    list.innerHTML = "";
    let count = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.restaurantId === user.uid) {
        count++;
        list.innerHTML += `
          <div class="food-listing-card">
            <div class="card-header">
              <span class="food-emoji">🍱</span>
              <span class="badge ${data.status === 'available' ? 'available' : 'claimed'}">${data.status}</span>
            </div>
            <h4>${data.foodName}</h4>
            <div class="card-details">
              <span>📦 ${data.quantity} ${data.unit}</span>
              <span>⏰ ${data.availableFrom} - ${data.availableUntil}</span>
            </div>
            <p class="card-address">📍 ${data.pickupAddress}</p>
          </div>
        `;
      }
    });

    if (count === 0) {
      list.innerHTML = `<p style="text-align:center; font-size:1.3rem; color:#aaa; font-family:'Poppins',sans-serif; padding:60px 0; width:100%;">No donations yet. <a href="post-food.html" style="color:#2d6a4f; font-weight:600;">Post your first donation!</a></p>`;
    }
  } catch (error) {
    console.error(error);
  }
}

// run on page load
auth.onAuthStateChanged((user) => {
  if (user) {
    loadMyDonations();
    loadListings();
    loadRestaurantDashboard();
    loadNGODashboard();
    loadClaimedFood();
    loadVolunteerDashboard();
    loadMyDeliveries();
  }
});

// FETCH LISTINGS (NGO + Volunteer)
async function loadListings() {
  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    const grid = document.getElementById("listingsGrid") || document.getElementById("nearbyFood");
    if (!grid) return;

    grid.innerHTML = "";
    let count = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.status === "available") {
        count++;
        grid.innerHTML += `
          <div class="food-listing-card">
            <div class="card-header">
              <span class="food-emoji">🍱</span>
              <span class="badge available">Available</span>
            </div>
            <h4>${data.foodName}</h4>
            <p class="restaurant-name">📦 ${data.category}</p>
            <div class="card-details">
              <span>📦 ${data.quantity} ${data.unit}</span>
              <span>⏰ ${data.availableFrom} - ${data.availableUntil}</span>
            </div>
            <p class="card-address">📍 ${data.pickupAddress}</p>
            <button class="claim-btn" onclick="claimFood(this, '${docSnap.id}')">Claim Food</button>
          </div>
        `;
      }
    });

    if (count === 0) {
      grid.innerHTML = `<p style="text-align:center; font-size:1.3rem; color:#aaa; font-family:'Poppins',sans-serif; padding:60px 0; width:100%;">No food available right now. Check back later!</p>`;
    }
  } catch (error) {
    console.error(error);
  }
}

window.loadMyDonations = loadMyDonations;
window.loadListings = loadListings;

// LOAD RESTAURANT DASHBOARD STATS
async function loadRestaurantDashboard() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    let total = 0;
    let claimed = 0;
    let pending = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.restaurantId === user.uid) {
        total++;
        if (data.status === "claimed") claimed++;
        else pending++;
      }
    });

    if (document.getElementById("totalDonations")) document.getElementById("totalDonations").textContent = total;
    if (document.getElementById("claimed")) document.getElementById("claimed").textContent = claimed;
    if (document.getElementById("pending")) document.getElementById("pending").textContent = pending;
    if (document.getElementById("impact")) document.getElementById("impact").textContent = claimed * 5;

  } catch (error) {
    console.error(error);
  }
}

// LOAD NGO DASHBOARD STATS
async function loadNGODashboard() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    let available = 0;
    let claimed = 0;
    let restaurants = new Set();

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.status === "available") available++;
      if (data.claimedBy === user.uid) {
        claimed++;
        restaurants.add(data.restaurantId);
      }
    });

    if (document.getElementById("available")) document.getElementById("available").textContent = available;
    if (document.getElementById("totalClaimed")) document.getElementById("totalClaimed").textContent = claimed;
    if (document.getElementById("peopleFed")) document.getElementById("peopleFed").textContent = claimed * 5;
    if (document.getElementById("restaurants")) document.getElementById("restaurants").textContent = restaurants.size;

  } catch (error) {
    console.error(error);
  }
}

// LOAD CLAIMED FOOD (NGO)
async function loadClaimedFood() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    const list = document.getElementById("claimedList");
    if (!list) return;

    list.innerHTML = "";
    let count = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.claimedBy === user.uid) {
        count++;
        list.innerHTML += `
          <div class="food-listing-card">
            <div class="card-header">
              <span class="food-emoji">🍱</span>
              <span class="badge claimed">Claimed</span>
            </div>
            <h4>${data.foodName}</h4>
            <p class="restaurant-name">📦 ${data.category}</p>
            <div class="card-details">
              <span>📦 ${data.quantity} ${data.unit}</span>
              <span>⏰ ${data.availableFrom} - ${data.availableUntil}</span>
            </div>
            <p class="card-address">📍 ${data.pickupAddress}</p>
          </div>
        `;
      }
    });

    if (count === 0) {
      list.innerHTML = `<p style="text-align:center; font-size:1.3rem; color:#aaa; font-family:'Poppins',sans-serif; padding:60px 0; width:100%;">No claims yet. <a href="listings.html" style="color:#2d6a4f; font-weight:600;">Browse available food!</a></p>`;
    }
  } catch (error) {
    console.error(error);
  }
}

// LOAD VOLUNTEER DASHBOARD STATS
async function loadVolunteerDashboard() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    let available = 0;
    let delivered = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.status === "available") available++;
      if (data.claimedBy === user.uid) delivered++;
    });

    if (document.getElementById("totalDeliveries")) document.getElementById("totalDeliveries").textContent = delivered;
    if (document.getElementById("foodClaimed")) document.getElementById("foodClaimed").textContent = delivered;
    if (document.getElementById("peopleFed")) document.getElementById("peopleFed").textContent = delivered * 3;
    if (document.getElementById("points")) document.getElementById("points").textContent = delivered * 10;

  } catch (error) {
    console.error(error);
  }
}

// LOAD MY DELIVERIES (Volunteer)
async function loadMyDeliveries() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const querySnapshot = await getDocs(collection(db, "foodListings"));
    const list = document.getElementById("deliveriesList");
    if (!list) return;

    list.innerHTML = "";
    let count = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.claimedBy === user.uid) {
        count++;
        list.innerHTML += `
          <div class="food-listing-card">
            <div class="card-header">
              <span class="food-emoji">🍱</span>
              <span class="badge claimed">Delivered</span>
            </div>
            <h4>${data.foodName}</h4>
            <p class="restaurant-name">📦 ${data.category}</p>
            <div class="card-details">
              <span>📦 ${data.quantity} ${data.unit}</span>
              <span>⏰ ${data.availableFrom} - ${data.availableUntil}</span>
            </div>
            <p class="card-address">📍 ${data.pickupAddress}</p>
          </div>
        `;
      }
    });

    if (count === 0) {
      list.innerHTML = `<p style="text-align:center; font-size:1.3rem; color:#aaa; font-family:'Poppins',sans-serif; padding:60px 0; width:100%;">No deliveries yet. <a href="available.html" style="color:#2d6a4f; font-weight:600;">Find food to deliver!</a></p>`;
    }
  } catch (error) {
    console.error(error);
  }
}
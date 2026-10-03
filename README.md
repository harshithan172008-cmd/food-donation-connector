# 🍱 Food Donation Connector

A full-stack web application that connects restaurants with surplus food to NGOs and volunteers, reducing food waste and fighting hunger in local communities.

---

## 🌐 Live Demo
> Coming soon on Netlify

## 👤 Test Accounts
- Restaurant: `test@restaurant.com` / `test123`
- NGO: `test@ngo.com` / `test123`
- Volunteer: `test@volunteer.com` / `test123`

---

## 💡 Problem Statement
Every day, thousands of restaurants throw away surplus food while millions of people go hungry. There is no efficient system connecting food donors with those who need it most. Food Donation Connector bridges this gap in real time.

---

## ✅ Solution
A three-role web platform where:
- **Restaurants** post surplus food with quantity, pickup time and location
- **NGOs** browse and claim food in bulk for distribution
- **Volunteers** claim smaller portions and deliver directly to hungry people nearby

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6) |
| Backend | Firebase (BaaS) |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore (NoSQL, real-time) |
| Hosting | Netlify (CI/CD via GitHub) |
| Version Control | Git & GitHub |
| Fonts | Google Fonts (Poppins, Playfair Display, Lilita One) |

---

## 🔑 Key Features

### 🍽️ Restaurant Side
- Secure signup and login
- Post surplus food with name, category, quantity, pickup time and address
- View all posted donations with real-time status (Available / Claimed)
- See who claimed the food — name, role, email, phone, pickup time and estimated people to feed
- Dashboard with total donations, claimed count, pending count and impact stats

### 🏢 NGO Side
- Secure signup and login
- Browse all available food donations in real time
- View full details of each listing including notes from restaurant
- Claim food with pickup time, contact number and estimated people to feed
- Track all claimed food
- Dashboard with available food count, total claimed and people fed

### 🙋 Volunteer Side
- Secure signup and login
- Find available food nearby
- Claim and deliver food to hungry people
- Track all deliveries
- Dashboard with delivery count, people fed and volunteer points

---

## 📊 Impact

| Metric | Value |
|--------|-------|
| Food Waste Reduced | Real-time tracking |
| People Fed | Calculated per claim |
| Roles Supported | 3 (Restaurant, NGO, Volunteer) |
| Database | Cloud-based, real-time |
| Cost | Zero — free tech stack |

---

## 🚀 Feasibility

- **Technical** — Built with free, industry-standard tools (Firebase, Netlify, HTML/CSS/JS)
- **Financial** — Zero cost to run on Firebase Spark (free) plan
- **Scalability** — Firebase Firestore scales automatically with users
- **Accessibility** — Works on any device with a browser, no app download needed
- **Real-world ready** — Can be deployed and used by real restaurants and NGOs immediately

---

## 📁 Project Structure
food-donation-connector/
├── index.html ← Landing page
├── css/
│ ├── style.css ← Global styles
│ ├── auth.css ← Login/Signup styles
│ ├── dashboard.css ← Dashboard styles
│ └── listings.css ← Food listing card styles
├── js/
│ ├── firebase-config.js ← Firebase initialization
│ └── app.js ← All JavaScript logic
├── restaurant/
│ ├── login.html
│ ├── signup.html
│ ├── dashboard.html
│ ├── post-food.html
│ └── my-donations.html
├── ngo/
│ ├── login.html
│ ├── signup.html
│ ├── dashboard.html
│ ├── listings.html
│ └── claimed.html
├── volunteer/
│ ├── login.html
│ ├── signup.html
│ ├── dashboard.html
│ ├── available.html
│ └── my-deliveries.html
└── images/
├── hero-bg.png
├── hungry1.png
├── hungry2.png
├── hungry3.png
├── ngo.png
├── volunteer.png
└── restaurant-bg.png


---

## 🔮 Future Scope
- Email notifications via EmailJS when food is claimed
- Map integration using Leaflet.js to show nearby food
- Mobile app version
- Rating system for restaurants and NGOs
- Admin panel for monitoring all activity
- Push notifications for real-time alerts

---

## 👩‍💻 Developed By
**Harshitha N**
Computer Science Engineering
M S Ramaiah Institute of Technology, Bengaluru

---

## 📄 License
This project is for academic purposes.

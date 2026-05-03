# 🛒 ShopIT - MERN Stack E-Commerce & Admin Dashboard

A comprehensive, full-stack e-commerce application featuring a dynamic storefront, integrated payment logic, and a robust Admin suite for business management.

---

## 🚀 Key Features

### **For Customers**
* **Dynamic Product Catalog:** Search, filter by category/price, and sort products seamlessly.
* **Advanced Review System:** Customers can submit reviews with real-time rating updates.
* **Secure Checkout:** Integrated with **Stripe** for professional and secure transactions.
* **User Profiles:** Fully customizable profiles with Cloudinary-integrated avatar uploads.

### **For Admins**
* **Product Management:** Full CRUD capabilities for the product inventory.
* **User Administration:** Manage user roles, update profiles, or delete accounts with built-in safety checks.
* **Review Moderation:** Search for reviews by Product ID and moderate/delete inappropriate content.
* **Data-Driven Dashboard:** Real-time metrics for total users, orders, and stock levels.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Redux Toolkit (RTK), RTK Query, MDBootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens) & HTTP-only Cookies
- **Media Storage:** Cloudinary API
- **Payments:** Stripe API

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [YOUR_REPO_LINK]
cd [YOUR_REPO_FOLDER_NAME]

2. Environment Configuration
To run this project, you will need to create a .env file in your root directory and add the following variables. This ensures the app can connect to the database and external services securely.

Code snippet
PORT=3000
NODE_ENV=DEVELOPMENT

# Database
DB_LOCAL_URI=mongodb://127.0.0.1:27017/shopit

# Security
JWT_SECRET=[YOUR_RANDOM_SECRET_STRING]
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7

# Payments
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_STRIPE_WEBHOOK_SECRET]

# Media
CLOUDINARY_CLOUD_NAME=dv1f8oedo
CLOUDINARY_API_KEY=[YOUR_API_KEY]
CLOUDINARY_API_SECRET=[YOUR_API_SECRET]

# Frontend Link
FRONTEND_URL=http://localhost:5173

3. Install Dependencies
Bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

4. Run the Application
Bash
# From the root folder, run both frontend and backend concurrently
npm run dev
```
-----

👨‍💻 Lessons Learned
During this project, I mastered Full-Stack State Synchronization. A key challenge was ensuring the UI reflected database updates instantly without manual refreshes. I solved this by implementing RTK Query Tag Invalidation (specifically for Product and Reviews tags), which automates data re-fetching upon successful mutations. This project also strengthened my understanding of Mongoose middleware for calculating aggregate ratings and implementing Role-Based Access Control (RBAC) to secure administrative routes.

[Your Portfolio/LinkedIn Link :https://www.linkedin.com/in/palwasha-khan2201/]

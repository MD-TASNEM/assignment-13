## 🚀 MERN Micro-Task Platform - Complete Setup Guide

This is a production-ready MERN stack application with complete authentication, payment processing, task management, and admin controls.

---

## 📋 Prerequisites

- **Node.js** 16+ and npm/yarn
- **MongoDB** 4.4+ (local or MongoDB Atlas)
- **Stripe Account** (for payments)
- **ImageBB Account** (for image uploads)
- **Git** for version control

---

## 🛠️ Installation & Setup

### **1. Clone & Navigate**
```bash
git clone <your-repo-url>
cd assignment-13

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### **2. Configure Environment Variables**

#### **Server Setup (.env)**
```bash
# server/.env (create this file)

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_platform

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_min_20_chars

# Port
PORT=5000

# Node Environment
NODE_ENV=development

# Stripe Keys (from https://dashboard.stripe.com/keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Server Base URL
SERVER_URL=http://localhost:5000
```

#### **Client Setup (.env)**
```bash
# client/.env (create this file)

# Server Connection
VITE_SERVER_BASE_URL=http://localhost:5000

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# ImageBB API Key (from https://imgbb.com/api/)
VITE_IMAGEBB_API_KEY=your_imgbb_free_api_key

# GitHub Repo URL (optional, for social sharing)
VITE_GITHUB_REPO_URL=https://github.com/yourusername/yourrepo

# Firebase (optional, if using Firebase)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **3. Start Development Servers**

#### **Terminal 1: Start Backend**
```bash
cd server
npm start

# Expected output:
# Server listening on http://localhost:5000
# ✓ API Health Check: http://localhost:5000/api/health
```

#### **Terminal 2: Start Frontend**
```bash
cd client
npm run dev

# Expected output:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

---

## 🔑 Test Credentials

Use these accounts for testing:

### **Worker Account**
- **Email:** worker@test.com
- **Password:** worker123
- **Starting Coins:** 10

### **Buyer Account**
- **Email:** buyer@test.com
- **Password:** buyer123
- **Starting Coins:** 50

### **Admin Account**
- **Email:** admin@test.com
- **Password:** admin123
- **Role:** Admin

*(Create these accounts by registering on the platform)*

---

## 💳 Stripe Test Cards

For payment testing:

| Card Number | Expiry | CVC | Description |
|---|---|---|---|
| 4242 4242 4242 4242 | 12/25 | 123 | ✓ Successful payment |
| 4000 0000 0000 0002 | 12/25 | 123 | ❌ Declined card |
| 4000 0025 0000 3155 | 12/25 | 123 | 🔄 Requires authentication |

---

## 📱 Platform Features

### **Worker Features**
- ✅ Browse available tasks
- ✅ View task details and requirements
- ✅ Submit work with detailed information
- ✅ Track submission status
- ✅ Withdraw earnings (minimum 200 coins = $10)
- ✅ View payment history
- ✅ Receive notifications

### **Buyer Features**
- ✅ Create tasks with image uploads
- ✅ Set worker count and payment amount
- ✅ Review and approve/reject submissions
- ✅ Purchase coins via Stripe
- ✅ Track spending and payments
- ✅ View passive purchases (coin packs)
- ✅ Manage tasks

### **Admin Features**
- ✅ View platform statistics
- ✅ Manage all users
- ✅ Update user roles
- ✅ Delete problematic users
- ✅ Manage all tasks
- ✅ Delete inappropriate tasks
- ✅ Approve/reject withdrawal requests

---

## 🔗 API Endpoints

### **Authentication**
```
POST   /api/auth/register         - Create new account
POST   /api/auth/login            - Login user
GET    /api/auth/me               - Get current user (protected)
```

### **Users**
```
GET    /api/users                 - Get all users (admin)
GET    /api/users/:id             - Get user profile
PUT    /api/users/:id             - Update profile
PUT    /api/users/:id/role        - Update role (admin)
DELETE /api/users/:id             - Delete user (admin)
GET    /api/users/leaderboard/top-workers - Top 6 workers
```

### **Tasks**
```
GET    /api/tasks                 - List all tasks (paginated)
GET    /api/tasks/:id             - Get task details
POST   /api/tasks                 - Create task (buyer)
PUT    /api/tasks/:id             - Update task (buyer)
DELETE /api/tasks/:id             - Delete task (buyer/admin)
GET    /api/tasks/buyer/my-tasks  - Get buyer's tasks
```

### **Submissions**
```
POST   /api/submissions           - Submit task (worker)
GET    /api/submissions/:id       - Get submission details
GET    /api/submissions/worker/my-submissions - Worker's submissions
GET    /api/submissions/buyer/to-review - Pending submissions for buyer
PUT    /api/submissions/:id/approve - Approve submission (buyer)
PUT    /api/submissions/:id/reject - Reject submission (buyer)
```

### **Payments**
```
POST   /api/payments/create-intent - Create Stripe PaymentIntent
POST   /api/payments/confirm      - Confirm payment & add coins
GET    /api/payments/history      - Get payment history (buyer)
```

### **Withdrawals**
```
POST   /api/withdrawals           - Request withdrawal (worker)
GET    /api/withdrawals/worker/my-withdrawals - Worker's withdrawals
GET    /api/withdrawals/admin/pending - Pending withdrawals (admin)
PUT    /api/withdrawals/:id/approve - Approve withdrawal (admin)
PUT    /api/withdrawals/:id/reject - Reject withdrawal (admin)
```

### **Notifications**
```
GET    /api/notifications         - Get user's notifications
PUT    /api/notifications/:id/read - Mark as read
PUT    /api/notifications/read/all - Mark all as read
DELETE /api/notifications/:id     - Delete notification
```

---

## 💰 Coin Economy

| Action | Coins | USD Equivalent |
|--------|-------|-----------------|
| **Worker Registration** | 10 | - |
| **Buyer Registration** | 50 | - |
| **Withdrawal Rate** | 20 | $1.00 |
| **Minimum Withdrawal** | 200 | $10.00 |
| **Coin Pack 1** | 10 | $1.00 |
| **Coin Pack 2** | 150 | $10.00 |
| **Coin Pack 3** | 500 | $20.00 |
| **Coin Pack 4** | 1000 | $35.00 |

---

## 📂 Project Structure

```
assignment-13/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Submission.js
│   │   ├── Payment.js
│   │   ├── Withdrawal.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── tasks.js
│   │   ├── submissions.js
│   │   ├── payments.js
│   │   ├── withdrawals.js
│   │   └── notifications.js
│   ├── middleware/
│   │   └── authUtils.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Worker/
│   │   │   ├── Buyer/
│   │   │   └── Admin/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── imageUpload.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── PHASE6_FEATURES.md
├── COMPLETION_SUMMARY.md
└── PROJECT_STATUS.md
```

---

## 🧪 Testing Guide

### **1. User Registration & Authentication**
```
1. Go to /register
2. Fill out form (Worker or Buyer)
3. Optional: Upload profile photo
4. Submit form
5. Should redirect to /login
6. Login with credentials
7. Should redirect to /dashboard
```

### **2. Task Creation (Buyer)**
```
1. Login as Buyer
2. Go to /dashboard/buyer-add-task
3. Fill form with task details
4. Upload task image (optional)
5. Click "Add Task"
6. Should appear in MyTasks list
```

### **3. Task Submission (Worker)**
```
1. Login as Worker
2. Go to /dashboard/worker-task-list
3. Click any task title
4. View TaskDetails page
5. Fill submission form
6. Click "Submit Task"
7. Should appear in Submissions with "pending" status
```

### **4. Submission Review (Buyer)**
```
1. Login as Buyer
2. Go to /dashboard
3. Click "Review Submissions"
4. Click on pending submission
5. See details and approve/reject buttons
6. Approve: Worker receives coins
7. Reject: Task slot re-opens for other workers
```

### **5. Payment Processing (Buyer)**
```
1. Login as Buyer
2. Go to /dashboard/buyer-purchase-coin
3. Select coin package
4. Fill Stripe card details (use 4242 4242 4242 4242)
5. Click "Buy Coins"
6. Should show success + new balance
7. Coins added to wallet
```

### **6. Withdrawal (Worker)**
```
1. Login as Worker
2. Have at least 200 coins
3. Go to /dashboard/worker-withdrawals
4. Fill withdrawal form
5. Select payment method
6. Request withdrawal
7. Admin must approve (as admin: /dashboard/admin-home)
8. Worker coins deducted on approval
```

### **7. Notifications**
```
1. Click bell icon in Navbar
2. See list of notifications
3. Red badge shows unread count
4. Click notification to mark as read
5. Can delete individual notifications
6. "Mark all as read" option available
```

---

## 🐛 Troubleshooting

### **"Cannot find module" errors**
```bash
# Solution: Reinstall dependencies
cd server && npm install && cd ../client && npm install
```

### **MongoDB connection refused**
```bash
# Check if MongoDB is running
# If local: mongod should be running in background
# If Atlas: Check connection string in .env
# Verify IP whitelist in MongoDB Atlas
```

### **Stripe payment fails**
```bash
# Check: STRIPE_SECRET_KEY in server/.env
# Check: VITE_STRIPE_PUBLIC_KEY in client/.env
# Use test keys (pk_test_*, sk_test_*)
# Don't use live keys in development
```

### **Image upload not working**
```bash
# Check: VITE_IMAGEBB_API_KEY in client/.env
# Get free key: https://imgbb.com/api/
# Verify key is correct
# Check max file size (5MB limit)
```

### **CORS errors**
```bash
# Solution already in place in server/index.js
# CORS is configured to allow localhost:5173
# If using different port, update CORS config
```

---

## 🚀 Deployment

### **Frontend (Firebase Hosting)**
```bash
cd client
npm run build
firebase login
firebase deploy
```

### **Backend (Vercel/Railway)**
```bash
# Recommended: Railway or Render
# Push your repo to GitHub
# Connect to deployment platform
# Set environment variables
# Auto-deploy on push
```

### **Database (MongoDB Atlas)**
```bash
1. Create MongoDB Atlas account
2. Create cluster (free tier available)
3. Get connection string
4. Add IP whitelist
5. Set MONGODB_URI in production .env
```

---

## 📊 Database Schema Overview

### **User**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'Worker' | 'Buyer' | 'Admin',
  coins: Number,
  photo_url: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Task**
```javascript
{
  title: String,
  detail: String,
  buyer_id: ObjectId (ref: User),
  buyer_email: String,
  buyer_name: String,
  required_workers: Number,
  payable_amount: Number,
  total_payable: Number (calculated),
  completion_date: Date,
  submission_info: String,
  task_image_url: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Submission**
```javascript
{
  task_id: ObjectId (ref: Task),
  worker_id: ObjectId (ref: User),
  buyer_id: ObjectId (ref: User),
  submission_details: String,
  status: 'pending' | 'approved' | 'rejected',
  payable_amount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

✅ **Password Hashing:** bcryptjs with 10 salt rounds
✅ **JWT Authentication:** 7-day token expiry
✅ **Protected Routes:** Role-based access control
✅ **CORS:** Configured to prevent unauthorized access
✅ **Environment Variables:** Secrets never committed
✅ **Input Validation:** Server-side validation on all endpoints
✅ **Error Handling:** Graceful error messages without exposing internals

---

## 📞 Support & Documentation

- **API Documentation:** See PROJECT_STATUS.md
- **Feature Overview:** See COMPLETION_SUMMARY.md
- **Phase 6 Details:** See PHASE6_FEATURES.md
- **Server README:** See server/README.md (if exists)
- **Client README:** See client/README.md (if exists)

---

## ✅ Quality Checklist

- [x] All 18 pages fully functional
- [x] 25+ API endpoints working
- [x] Real-time form validation
- [x] Error handling throughout
- [x] Loading states on all async operations
- [x] Responsive mobile-friendly design
- [x] Accessible UI (semantic HTML, ARIA labels)
- [x] Git history with meaningful commits
- [x] Environment configuration isolated
- [x] Ready for production deployment

---

## 📝 License

This project is created for educational purposes.

---

**Happy coding! 🎉**

For questions or issues, refer to the documentation files or check the git commit history for context on each feature.

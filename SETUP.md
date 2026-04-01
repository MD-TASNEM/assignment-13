# Project Setup Guide

## Quick Start

### Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB Atlas account
- Firebase project (for authentication)
- Stripe account (for payments)

## 1. Client Setup

### Step 1: Install Dependencies

```bash
cd client
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env.local
```

### Step 3: Configure Environment Variables

Edit `.env.local` and fill in:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_SERVER_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_IMGBB_API_KEY=your_imgbb_key
VITE_GITHUB_REPO_URL=your_client_repo_url
```

### Step 4: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Step 5: Build for Production

```bash
npm run build
```

## 2. Server Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Configure Environment Variables

Edit `.env` and fill in:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key_here

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

CLIENT_URL=http://localhost:5173
IMGBB_API_KEY=your_imgbb_api_key
```

### Step 4: Run Development Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Step 5: Test API Endpoints

```bash
curl http://localhost:5000/api/health
```

## 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password, Google)
4. Create a Realtime Database
5. Get your credentials from Project Settings
6. Update your `.env.local` (client) and `.env` (server) files

## 4. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Settings
3. Update `.env` file with your keys
4. Test with Stripe test cards (4242 4242 4242 4242)

## 5. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Add to `.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskearn
```

## 6. imageBB Setup

1. Go to [imageBB](https://imgbb.com)
2. Register and get your API key
3. Add to both `.env.local` and `.env`

## Project Structure

```
assignment-13/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # Auth context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                    # Node/Express Backend
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth middleware
│   ├── index.js              # Entry point
│   ├── .env.example
│   └── package.json
│
└── README.md                  # Project documentation
```

## Testing the Application

### Test User Accounts

**Worker Account:**

- Email: worker@test.com
- Password: Test@1234
- Role: Worker
- Initial Coins: 10

**Buyer Account:**

- Email: buyer@test.com
- Password: Test@1234
- Role: Buyer
- Initial Coins: 50

**Admin Account:**

- Email: admin@test.com
- Password: Test@1234
- Role: Admin

## Deployment

### Deploy Client (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Deploy Server (Vercel)

```bash
npm install -g vercel
vercel login
vercel
```

Or use [Railway](https://railway.app), [Render](https://render.com), or [Heroku](https://heroku.com)

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error

- Check your connection string
- Whitelist your IP in MongoDB Atlas
- Ensure database is created

### Firebase Error

- Verify your credentials
- Check Firebase console for errors
- Ensure APIs are enabled

### Stripe Integration Issues

- Use test mode keys
- Test cards: 4242 4242 4242 4242
- Check Stripe logs in dashboard

## Next Steps

1. ✅ Project structure created
2. ✅ Client pages built
3. ✅ Server models created
4. ⏳ Implement API endpoints
5. ⏳ Connect frontend to backend
6. ⏳ Add Firebase authentication
7. ⏳ Implement Stripe payments
8. ⏳ Add notification system
9. ⏳ Deploy to production
10. ⏳ Create meaningful git commits

## Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

If you encounter any issues:

1. Check the error message carefully
2. Review the logs in browser console (client) or terminal (server)
3. Verify all environment variables are set
4. Check API health: `curl http://localhost:5000/api/health`

---

**Last Updated:** April 2026

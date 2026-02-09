# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend .env file:**
```bash
cd backend
```

Edit `.env` with:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/ecommerce
PORT=5000
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Step 3: Start the Application

**Terminal 1 - Backend (from backend folder):**
```bash
npm run dev
```

You should see:
```
✓ Connected to MongoDB successfully
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend (from frontend folder):**
```bash
npm run dev
```

You should see:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Seed Sample Data

Open new terminal and run:
```bash
curl -X POST http://localhost:5000/api/items/seed
```

Or use Postman/Insomnia to POST to: `http://localhost:5000/api/items/seed`

### Step 5: Access the Application

Open browser and go to: **http://localhost:5173**

## 📝 Test the Application

### 1. Register a User
- Click "Don't have an account? Register here"
- Username: `testuser`
- Password: `test123`
- Click Register

### 2. Login
- Username: `testuser`
- Password: `test123`
- Click Login

### 3. Browse Products
- You should see 6 sample products

### 4. Add Items to Cart
- Click "Add to Cart" on any product
- Repeat for multiple items

### 5. View Cart
- Click "Cart" button in navbar
- See all items and total price

### 6. Place Order
- Click "Place Order" button
- Confirm success message

### 7. View Order History
- Click "Order History" in navbar
- See your placed order with details

### 8. Logout
- Click "Logout" button
- Confirm logout

### 9. Test Single-Device Lock
- Login to the application in current window
- Open incognito/private window
- Try to login with same credentials
- You should get error: "already logged in on another device"

## 🔗 API Endpoints

### Public Endpoints
- `GET /api/items` - Get all products
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user

### Protected Endpoints (Requires JWT Token)
- `POST /api/carts` - Add item to cart
- `GET /api/carts` - Get user's cart
- `POST /api/orders` - Place order
- `GET /api/orders` - Get order history

Add header: `Authorization: <token>`

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection error
```
**Solution:** Check your connection string in `.env`
- Verify username/password
- Check cluster name
- Ensure IP whitelist includes your machine

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env` or kill process using port 5000

### CORS Error
```
Cross-Origin Request Blocked
```
**Solution:** Ensure backend is running and CLIENT_URL is correct in `.env`

### Frontend Can't Load
Clear browser cache:
- DevTools > Application > Clear site data
- Or use Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)

## 📚 Key Features Implemented

✅ User registration & login
✅ JWT authentication
✅ Single-device session management
✅ Product catalog
✅ Shopping cart
✅ Order placement
✅ Order history
✅ Responsive design
✅ Error handling
✅ Token validation middleware

## 🔐 Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Single-device enforcement prevents unauthorized access
- CORS is configured for frontend only
- Protected routes validate token against database

## 📞 Support

Check the main README.md for:
- Complete API documentation
- Architecture details
- Development guide

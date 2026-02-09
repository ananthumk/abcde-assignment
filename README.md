# E-Commerce Application

A full-stack e-commerce web application with single-device session management, built with Node.js/Express (backend) and React/Vite (frontend).

## Features

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure token-based user authentication
- **Single-Device Session Management**: Users can only be logged in on one device at a time
- **Password Hashing**: Passwords are securely hashed using bcryptjs
- **Token Validation**: All protected endpoints validate JWT tokens against database records

### 🛍️ E-Commerce Features
- **User Management**: Register and login functionality
- **Product Catalog**: Browse available products with descriptions and prices
- **Shopping Cart**: Add/remove items from persistent user carts
- **Order Management**: Place orders from cart and view order history
- **Real-time Updates**: Live cart updates and order confirmation

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern Components**: Built with React and Lucide icons
- **Intuitive Navigation**: Easy-to-use navigation between shopping, cart, and orders
- **Error Handling**: Clear error messages and user feedback

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication token generation
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

## Project Structure

```
shopping-cart-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model with token field
│   │   ├── Item.js          # Product model
│   │   ├── Cart.js          # Shopping cart model
│   │   └── Order.js         # Order model
│   ├── routes/
│   │   ├── userRoutes.js    # Auth and user endpoints
│   │   ├── itemRoutes.js    # Product endpoints
│   │   ├── cartRoutes.js    # Cart management endpoints
│   │   └── orderRoutes.js   # Order endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express app setup
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx     # Login/Register form
    │   │   ├── ItemList.jsx  # Product browse & cart management
    │   │   └── Navbar.jsx    # Navigation bar
    │   ├── contexts/
    │   │   └── AuthContext.jsx # Auth state management
    │   ├── App.jsx           # Main app component
    │   ├── main.jsx          # Entry point
    │   ├── App.css
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with following variables:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key_here
```

4. Start the server:
```bash
npm run dev    # For development with nodemon
npm start      # For production
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### Register User
**POST** `/api/users`
```json
{
  "username": "john_doe",
  "password": "password123"
}
```
Response: `{ "message": "User created successfully" }`

#### Login
**POST** `/api/users/login`
```json
{
  "username": "john_doe",
  "password": "password123"
}
```
Response: `{ "token": "eyJhbGc..." }`

#### Logout
**POST** `/api/users/logout` (Protected)
Response: `{ "message": "Logged out successfully" }`

### Product Endpoints

#### Get All Items
**GET** `/api/items`
Response: Array of item objects with id, name, price, description

#### Seed Sample Items
**POST** `/api/items/seed`
Response: `{ "message": "Sample items seeded successfully", "count": 6 }`

### Cart Endpoints

#### Add Item to Cart
**POST** `/api/carts` (Protected)
```json
{
  "itemId": "product_id"
}
```

#### Get User's Cart
**GET** `/api/carts` (Protected)
Response: Cart object with array of items

#### Remove Item from Cart
**DELETE** `/api/carts/:itemId` (Protected)

#### Clear Cart
**DELETE** `/api/carts` (Protected)

### Order Endpoints

#### Place Order
**POST** `/api/orders` (Protected)
Response: `{ "message": "Order placed successfully", "orderId": "...", "total": 999 }`

#### Get Order History
**GET** `/api/orders` (Protected)
Response: Array of order objects

#### Get Order Details
**GET** `/api/orders/:orderId` (Protected)

## How Single-Device Session Management Works

1. **Registration & First Login**
   - User creates account and logs in
   - System generates JWT token
   - Token is stored in user's database record and localStorage

2. **Preventing Multiple Logins**
   - When user tries to login from another device
   - System checks if user already has an active token
   - If token exists in database, login is denied with error message
   - Frontend displays: "You are already logged in on another device"

3. **Logout & Cleanup**
   - User clicks logout
   - Token is removed from database record
   - Browser localStorage is cleared
   - User can now login from same or different device

4. **Token Validation**
   - Every protected API call includes JWT in Authorization header
   - Auth middleware verifies token signature
   - Middleware also confirms token matches one stored in database
   - If tokens don't match, session is invalid

## Usage Guide

### 1. Register a New Account
- Navigate to login page
- Click "Don't have an account? Register here"
- Enter username and password
- Click Register button

### 2. Login
- Enter username and password
- Click Login button
- If already logged in elsewhere, you'll see error message

### 3. Browse Products
- After login, you'll see available products
- Products are displayed in a grid with name, description, and price

### 4. Add Items to Cart
- Click "Add to Cart" button on any product
- Item will be added to your shopping cart
- See cart count in navbar

### 5. View & Manage Cart
- Click "Cart" button in navigation
- View all items in cart with total price
- Each item shows name, description, and price

### 6. Place Order
- Go to Cart view
- Review items and total price
- Click "Place Order" button
- Order is immediately created and cart is cleared

### 7. View Order History
- Click "Order History" button in navigation
- See all past orders with dates and items
- Order details include order ID, total, date, and items purchased

### 8. Logout
- Click "Logout" button in top-right
- Confirm logout
- Token is cleared from database
- Session ends and you can login again (on any device)

## Error Handling

The application provides clear error messages for:
- Invalid login credentials
- User already logged in on another device
- Cart is empty when placing order
- Item not found
- Session expired or invalid token
- Network errors
- Server errors

## Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens with expiration (7 days)
- ✅ Single-device session enforcement
- ✅ Token validation on every protected request
- ✅ CORS configured for frontend origin only
- ✅ Protected API endpoints require valid authentication
- ✅ User data isolation (users can only see their own orders)

## Development Notes

### Adding More Products
Run the seed endpoint to populate sample items:
```bash
POST http://localhost:5000/api/items/seed
```

### Debugging
- Backend console logs: Check terminal where server is running
- Frontend console: Open browser dev tools (F12)
- API requests: Check Network tab in browser dev tools

### Environment Variables
- `MongoDB`: Connection string in `.env`
- `JWT_SECRET`: Change in production to a strong secret
- `PORT`: Change if needed for different port

## Future Enhancements

- [ ] Product search and filtering
- [ ] Item quantity selection in cart
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Wishlist feature
- [ ] Email notifications
- [ ] Order tracking
- [ ] Inventory management

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure PORT 5000 is not in use
- Install all dependencies: `npm install`

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS origin in server.js
- Clear browser cache and localStorage

### Login fails with "already logged in" error
- Open new incognito/private window to test
- Or logout from other device/browser first
- Check database to verify token is cleared on logout

### Items not showing in cart
- Ensure you're logged in
- Check that POST to /api/carts is successful
- Verify item ID is valid

## License

MIT License - Feel free to use this for learning and development.

## Support

For issues or questions:
1. Check the error message carefully
2. Review the API documentation
3. Check browser console and server logs
4. Verify all environment variables are set correctly

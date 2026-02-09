# API Testing Guide

## Testing with cURL

### 1. Seed Sample Products
```bash
curl -X POST http://localhost:5000/api/items/seed
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

Response will be:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save this token for the next requests. Replace `<TOKEN>` with the actual token.

### 4. Get All Items
```bash
curl http://localhost:5000/api/items
```

### 5. Get User's Cart
```bash
curl http://localhost:5000/api/carts \
  -H "Authorization: <TOKEN>"
```

### 6. Add Item to Cart
Replace `<ITEM_ID>` with the ID from items list and `<TOKEN>` with your token:

```bash
curl -X POST http://localhost:5000/api/carts \
  -H "Authorization: <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "<ITEM_ID>"
  }'
```

### 7. Place Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: <TOKEN>" \
  -H "Content-Type: application/json"
```

### 8. Get Order History
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: <TOKEN>"
```

### 9. Logout
```bash
curl -X POST http://localhost:5000/api/users/logout \
  -H "Authorization: <TOKEN>"
```

---

## Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Select "Link" tab
4. Paste the following (or create manually following examples below)

### Collection Structure

#### 1. Authentication
- **Register**: POST `http://localhost:5000/api/users`
  ```json
  {
    "username": "testuser",
    "password": "test123"
  }
  ```

- **Login**: POST `http://localhost:5000/api/users/login`
  ```json
  {
    "username": "testuser",
    "password": "test123"
  }
  ```
  
  After login, copy the token and set it as a Postman variable:
  - Click "Tests" tab
  - Add: `pm.environment.set("token", pm.response.json().token);`

- **Logout**: POST `http://localhost:5000/api/users/logout`
  - Header: `Authorization: {{token}}`

#### 2. Items
- **Get All Items**: GET `http://localhost:5000/api/items`

- **Seed Items**: POST `http://localhost:5000/api/items/seed`

#### 3. Cart
- **Add to Cart**: POST `http://localhost:5000/api/carts`
  - Header: `Authorization: {{token}}`
  - Body:
    ```json
    {
      "itemId": "copy_an_id_from_items"
    }
    ```

- **Get Cart**: GET `http://localhost:5000/api/carts`
  - Header: `Authorization: {{token}}`

- **Clear Cart**: DELETE `http://localhost:5000/api/carts`
  - Header: `Authorization: {{token}}`

- **Remove Item**: DELETE `http://localhost:5000/api/carts/<itemId>`
  - Header: `Authorization: {{token}}`

#### 4. Orders
- **Place Order**: POST `http://localhost:5000/api/orders`
  - Header: `Authorization: {{token}}`

- **Get Order History**: GET `http://localhost:5000/api/orders`
  - Header: `Authorization: {{token}}`

- **Get Order Details**: GET `http://localhost:5000/api/orders/<orderId>`
  - Header: `Authorization: {{token}}`

---

## Testing Flow

### Complete User Journey

1. **Seed Sample Data**
   ```bash
   POST /api/items/seed
   ```
   Response: 6 sample products added

2. **Register**
   ```bash
   POST /api/users
   {"username": "john", "password": "john123"}
   ```
   Response: User created

3. **Login**
   ```bash
   POST /api/users/login
   {"username": "john", "password": "john123"}
   ```
   Response: `{"token": "..."}`

4. **Get Items**
   ```bash
   GET /api/items
   ```
   Response: Array of 6 items

5. **Add 2 Items to Cart**
   ```bash
   POST /api/carts
   {"itemId": "<id1>"}
   
   POST /api/carts
   {"itemId": "<id2>"}
   ```
   Response: Items added

6. **View Cart**
   ```bash
   GET /api/carts
   ```
   Response: Cart with 2 items and total

7. **Place Order**
   ```bash
   POST /api/orders
   ```
   Response: Order created, cart cleared

8. **Check Order History**
   ```bash
   GET /api/orders
   ```
   Response: 1 order with 2 items

9. **Logout**
   ```bash
   POST /api/users/logout
   ```
   Response: Session cleared

---

## Test Cases for Single-Device Management

### Test 1: Prevent Second Login
1. Login with user "john" in Browser 1 → Token saved
2. Try login with user "john" in Browser 2
3. **Expected**: Error "already logged in on another device"
4. **Result**: ✓ Should fail

### Test 2: Allow Login After Logout
1. Login with user "john" in Browser 1
2. Click Logout in Browser 1
3. Try login with user "john" in Browser 2
4. **Expected**: Login succeeds
5. **Result**: ✓ Should succeed

### Test 3: Token Validation
1. Login and get token
2. Modify token in header slightly
3. Try to call protected endpoint
4. **Expected**: 401 Unauthorized
5. **Result**: ✓ Should reject

### Test 4: Expired Token
1. Logout (token cleared from DB)
2. Try to use old token on protected endpoint
3. **Expected**: 401 Unauthorized
4. **Result**: ✓ Should reject

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid token) |
| 403 | Forbidden (already logged in) |
| 404 | Not Found |
| 409 | Conflict (username exists) |
| 500 | Server Error |

---

## Sample Response Examples

### Successful Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWFiY2RlZjMzODU4YTAwMDEyMzQ1NjciLCJpYXQiOjE3MDU2NDMyMzksImV4cCI6MTcwNjI0ODAzOX0.5l7nV_KzBxG3J..."
}
```

### All Items
```json
[
  {
    "_id": "65abcdef338....",
    "name": "Laptop Pro",
    "price": 1299,
    "description": "High-performance laptop..."
  },
  ...
]
```

### Cart
```json
{
  "_id": "65abcd...",
  "user": "65abcd...",
  "items": [
    {
      "_id": "65abcd...",
      "name": "Laptop Pro",
      "price": 1299,
      "description": "..."
    }
  ]
}
```

### Order
```json
{
  "_id": "65abcd...",
  "user": "65abcd...",
  "items": [...],
  "total": 1299,
  "status": "completed",
  "createdAt": "2024-01-18T..."
}
```

---

## Error Response Examples

### Already Logged In (403)
```json
{
  "error": "You are already logged in on another device. Please logout first."
}
```

### Invalid Token (401)
```json
{
  "error": "Session invalid or expired. Please login again."
}
```

### Item Not Found (404)
```json
{
  "error": "Item not found"
}
```

### Cart Empty (400)
```json
{
  "error": "Cart is empty. Add items before placing an order."
}
```

---

## Tips for Testing

1. **Use Postman Variables**: Set `token` and `baseUrl` as environment variables
2. **Keep Track of IDs**: Copy product IDs from items response to use in cart requests
3. **Test Errors**: Try invalid tokens, wrong IDs, empty carts, etc.
4. **Monitor Logs**: Check terminal logs to see database operations
5. **Clear Data**: Delete users/items from MongoDB if needed for fresh testing
6. **Use Incognito Windows**: For testing multiple device sessions without clearing cookies

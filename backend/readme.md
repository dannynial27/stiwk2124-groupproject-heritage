## List of all the endpoints

### Authentication: Customer & Admin
| Endpoint          | Description  |
|-------------------|----------------------|
|POST http://localhost:8080/qurba/api/auth/register|Registration Process for Customer & admin|
|POST http://localhost:8080/qurba/api/auth/login|Login Process for Customer & Admin|

### Role: CUSTOMER
| Endpoint          | Description          |
|-------------------|----------------------|
|GET http://localhost:8080/qurba/api/products|List All Products|
|GET http://localhost:8080/qurba/api/products/sort?sortOrder=asc|Price - Sort Ascending|
|GET http://localhost:8080/qurba/api/products/sort?sortOrder=desc|Price - Sort Descending|
|GET http://localhost:8080/qurba/api/products/search?query=minyak|Search by Name or Description|
|GET http://localhost:8080/qurba/api/products/filter?category=madu|Filter by Category|
|GET http://localhost:8080/qurba/api/products/search-filter-sort?category=minuman&query=teh&sortOrder=asc|Combine - Sort, Filter, Search|
|POST http://localhost:8080/qurba/api/cart/{userid}/add?productId=1&quantity=2|Add Product to Cart|
|GET http://localhost:8080/qurba/api/cart/{userid}|Get User Carts|
|PUT http://localhost:8080/qurba/api/cart/{userid}/update?productld=1&quantity=3|Update Cart Item Quantity|
|DELETE http://localhost:8080/qurba/api/cart/{userid}/remove?productId=1|Remove Product from Cart|
|DELETE http://localhost:8080/qurba/api/cart/{userid}/clear|Clear Cart|
|POST http://localhost:8080/qurba/api/checkout/{userid}|Check Out Process|
|GET http://localhost:8080/qurba/api/orders/{userid}|View Orders|
|GET http://localhost:8080/qurba/api/orders/{orderid}/summary|View Summary|


### Role: ADMIN
| Endpoint          | Description          |
|-------------------|----------------------|
|GET  http://localhost:8080/qurba/api/admin/products|Get All Products|
|POST http://localhost:8080/qurba/api/admin/products|Add Product|
|PUT http://localhost:8080/qurba/api/admin/products/{productid}|Update Product|
|DELETE http://localhost:8080/qurba/api/admin/products/{productid}|Delete Product|
|GET http://localhost:8080/qurba/api/admin/orders|Get All Orders|

## API Usage Instructions

### Authentication

#### ADMIN Registration
**Endpoint:** POST http://localhost:8080/qurba/api/auth/register

**Instructions:**
1. In Postman, select Body > raw (JSON)
2. Enter JSON object with fields:
```
{
  "username": "admin121",
  "email": "admin123@example.com",
  "password": "Admin101!",
  "role": "ADMIN"
}
```
3. Send request to register as admin

#### ADMIN Login
**Endpoint:** POST http://localhost:8080/qurba/api/auth/login

**Instructions:**
1. In Postman, select Body > raw (JSON)
2. Enter JSON object with fields:
```
{
  "username": "admin121",
  "password": "Admin101!"
}
```
3. Send request to login
4. Copy the token value from response:
```
{
  "token": "xxxxxxx"
}
```

#### CUSTOMER Registration
**Endpoint:** POST http://localhost:8080/qurba/api/auth/register

**Instructions:**
1. In Postman, select Body > raw (JSON)
2. Enter JSON object with fields:
```
{
  "username": "AdamYau",
  "email": "AdamYau@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```
3. Send request to register as customer

#### CUSTOMER Login
**Endpoint:** POST http://localhost:8080/qurba/api/auth/login

**Instructions:**
1. In Postman, select Body > raw (JSON)
2. Enter JSON object with fields:
```
{
  "username": "AdamYau",
  "password": "password123"
}
```
3. Send request to login
4. Copy the token value from response:
```
{
  "token": "xxxxxxx"
}
```

### ADMIN Endpoints
#### View All Products

**Endpoint:** GET http://localhost:8080/qurba/api/admin/products

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the admin login token
3. Send request to view all products
   
#### Add Product
**Endpoint:** POST http://localhost:8080/qurba/api/admin/products

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the admin login token
3. Select Body > raw (JSON)
4. Enter product details:
```
{
  "name": "Sos Premium Burger",
  "description": "Sos that make you feels like burger",
  "price": 20.00,
  "category": "Sos",
  "stockQuantity": 30
}
```
5. Send request to add product

#### Update Product
**Endpoint:** PUT http://localhost:8080/qurba/api/admin/products/{productid}
**Instructions:**
1. Replace {productid} with the actual product ID
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Select Body > raw (JSON)
5. Enter updated product details:
```
{
  "name": "Sos Premium Burger",
  "description": "Sos that make you feels like burger",
  "price": 60.00,
  "category": "Sos",
  "stockQuantity": 60
}
```
6. Send request to update product

#### Delete Product
**Endpoint:** DELETE http://localhost:8080/qurba/api/admin/products/{productid}

**Instructions:**
1. Replace {productid} with the actual product ID
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Send request to delete product

#### View All Orders
**Endpoint:** GET http://localhost:8080/qurba/api/admin/orders

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the admin login token
3. Send request to view all customer orders

### CUSTOMER Endpoints

#### View All Products
**Endpoint:** GET http://localhost:8080/qurba/api/products

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the customer login token
3. Send request to view all products

#### Sort Products by Price (Ascending)
**Endpoint:** GET http://localhost:8080/qurba/api/products/sort?sortOrder=asc
**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the customer login token
3. Send request to view products sorted by price in ascending order

#### Sort Products by Price (Descending)
**Endpoint:** GET http://localhost:8080/qurba/api/products/sort?sortOrder=desc

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the customer login token
3. Send request to view products sorted by price in descending order

#### Search Products
**Endpoint:** GET http://localhost:8080/qurba/api/products/search?query=minyak

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the customer login token
3. Modify "minyak" to your search term if needed
4. Send request to search products by name or description

#### Filter Products by Category
**Endpoint:** GET http://localhost:8080/qurba/api/products/filter?category=Madu

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the customer login token
3. Modify "Madu" to your desired category if needed
4. Send request to filter products by category

#### Search, Filter, and Sort Products
**Endpoint:** GET http://localhost:8080/qurba/api/products/search-filter-sort?category=minuman&query=teh&sortOrder=asc

**Instructions:**
1. In Postman, select Authorization > Bearer Token
2. Paste the customer login token
3. Modify the query parameters as needed:
   - category=minuman
   - query=teh
   - sortOrder=asc
4. Send request to search, filter, and sort products simultaneously

#### Add Product to Cart
**Endpoint:** POST http://localhost:8080/qurba/api/cart/{userid}/add?productId=1&quantity=2

**Instructions:**
1. Replace {userid} with your user ID
2. Modify query parameters as needed:
   - productId=1
   - quantity=2
3. In Postman, select Authorization > Bearer Token
4. Paste the customer login token
5. Send request to add product to cart

#### View Cart Contents
**Endpoint:** GET http://localhost:8080/qurba/api/cart/{userid}

**Instructions:**
1. Replace {userid} with your user ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to view your cart contents

#### Update Cart Item Quantity
**Endpoint:** PUT http://localhost:8080/qurba/api/cart/{userid}/update?productld=1&quantity=3

**Instructions:**
1. Replace {userid} with your user ID
2. Modify query parameters as needed:
   - productId=1
   - quantity=3
3. In Postman, select Authorization > Bearer Token
4. Paste the customer login token
5. Send request to update product quantity in cart

#### Remove Product from Cart
**Endpoint:** DELETE http://localhost:8080/qurba/api/cart/{userid}/remove?productId=1

**Instructions:**
1. Replace {userid} with your user ID
2. Modify productId=1 as needed
3. In Postman, select Authorization > Bearer Token
4. Paste the customer login token
5. Send request to remove product from cart

#### Clear Cart
**Endpoint:** DELETE http://localhost:8080/qurba/api/cart/{userid}/clear

**Instructions:**
1. Replace {userid} with your user ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to clear all items from cart

#### Checkout
**Endpoint:** POST http://localhost:8080/qurba/api/checkout/{userid}

**Instructions:**
1. Replace {userid} with your user ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to checkout and place order

#### View Order History
**Endpoint:** GET http://localhost:8080/qurba/api/orders/{userid}

**Instructions:**
1. Replace {userid} with your user ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to view your order history

#### View Order Summary
**Endpoint:** GET http://localhost:8080/qurba/api/orders/{orderid}/summary

**Instructions:**
1. Replace {orderid} with the specific order ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to view detailed order summary

## link for the YouTube Presentation
```sql
https://youtu.be/KmkVhyES83o
```
## Result/Output (Screenshot of the output)

### Authentication: ADMIN
| Endpoint          | Images     |
|-------------------|----------------------|
|POST http://localhost:8080/qurba/api/auth/register|![image](https://github.com/user-attachments/assets/f98d3833-9a6c-4466-9416-91989dcaee17)|
|POST http://localhost:8080/qurba/api/auth/login|![image](https://github.com/user-attachments/assets/907cbe3c-7661-4cb3-8c05-5cc644b4363d)|

### Authentication: CUSTOMER
| Endpoint          | Images     |
|-------------------|----------------------|
|POST http://localhost:8080/qurba/api/auth/register|![image](https://github.com/user-attachments/assets/c701d2cb-5f76-4713-955c-f236c63cef13)|
|POST http://localhost:8080/qurba/api/auth/login|![image](https://github.com/user-attachments/assets/14e102e0-ec56-44f5-b81a-965ebf1cc366)|

### Output: ADMIN
| Endpoint          | Images     |
|-------------------|----------------------|
|GET  http://localhost:8080/qurba/api/admin/products|![image](https://github.com/user-attachments/assets/1089c801-a3a7-414e-9d62-cfba08b4ec57)|
|POST http://localhost:8080/qurba/api/admin/products|![image](https://github.com/user-attachments/assets/b72c82a8-e0e9-47f4-a007-43101002f64f)|
|PUT http://localhost:8080/qurba/api/admin/products/{productid}|![image](https://github.com/user-attachments/assets/f9510070-d2df-4d41-b7f2-b8cb699b6cd4)|
|DELETE http://localhost:8080/qurba/api/admin/products/{productid}|![image](https://github.com/user-attachments/assets/6c4077fe-976b-4c13-9c7a-f61b99d9a8bc)|
|GET http://localhost:8080/qurba/api/admin/orders|![image](https://github.com/user-attachments/assets/8766bcba-a47b-4d25-9c2d-80604a3c4abc)|
### Output: Customer
| Endpoint          | Images     |
|-------------------|----------------------|
|GET http://localhost:8080/qurba/api/products|![Screenshot 2025-05-04 232336](https://github.com/user-attachments/assets/74ab7cb0-aa64-493c-b69d-ad5c43cd9309)|
|GET http://localhost:8080/qurba/api/products/sort?sortOrder=asc|![Screenshot 2025-05-04 232354](https://github.com/user-attachments/assets/510f1f77-3716-4b6b-be30-8c43344b0246)|
|GET http://localhost:8080/qurba/api/products/sort?sortOrder=desc|![Screenshot 2025-05-04 232414](https://github.com/user-attachments/assets/e66cba94-c1fb-4c05-b1da-8283e1aec8b2)|
|GET http://localhost:8080/qurba/api/products/search?query=minyak|![Screenshot 2025-05-04 232520](https://github.com/user-attachments/assets/fb02ae88-6fc3-47e0-a483-e88ff42e2be1)|
|GET http://localhost:8080/qurba/api/products/filter?category=Madu|![Screenshot 2025-05-04 232607](https://github.com/user-attachments/assets/26a6597a-6889-4a9c-9ede-3b01b271a116)|
|GET http://localhost:8080/qurba/api/products/search-filter-sort?category=minuman&query=teh&sortOrder=asc|![Screenshot 2025-05-04 232957](https://github.com/user-attachments/assets/14b91427-ee9c-42e3-99a0-de33bc5c7906)|
|POST http://localhost:8080/qurba/api/cart/{userid}/add?productId=1&quantity=2|![image](https://github.com/user-attachments/assets/019cf54b-a1a2-4d45-89c2-23216aa2adbb)|
|GET http://localhost:8080/qurba/api/cart/{userid}|![image](https://github.com/user-attachments/assets/956508d9-d09b-433f-becc-e4d55a78437a)|
|PUT http://localhost:8080/qurba/api/cart/{userid}/update?productld=1&quantity=3|![image](https://github.com/user-attachments/assets/1beb647d-1e83-47b7-b521-c64bd37e1310)|
|DELETE http://localhost:8080/qurba/api/cart/{userid}/remove?productId=1|![image](https://github.com/user-attachments/assets/3a7b6bce-21b0-41e8-aeb1-ff4e035fce82)|
|DELETE http://localhost:8080/qurba/api/cart/{userid}/clear|![image](https://github.com/user-attachments/assets/aee77cd2-00b8-4610-b799-c2dc7f723ff4)|
|POST http://localhost:8080/qurba/api/checkout/{userid}|![image](https://github.com/user-attachments/assets/34d13486-4e3e-4382-9ee8-66221b94ae8f)|
|GET http://localhost:8080/qurba/api/orders/{userid}|![image](https://github.com/user-attachments/assets/b87e74ca-cff8-4d3f-be19-1c1ade43ef0e)|
|GET http://localhost:8080/qurba/api/orders/{orderid}/summary|![image](https://github.com/user-attachments/assets/170148b3-0312-46b2-8f75-ead0f7c12b0a)|

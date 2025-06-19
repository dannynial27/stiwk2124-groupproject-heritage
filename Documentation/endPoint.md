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
|GET http://localhost:8080/qurba/api/reviews/product/{productId}|Fetch all reviews for a product|
|POST http://localhost:8080/qurba/api/reviews/{userId}|Add review|
|PUT http://localhost:8080/qurba/api/reviews/{userId}/{reviewId}|Edit review|
|DELETE http://localhost:8080/qurba/api/reviews/{userId}/{reviewId}|Delete review|
|GET http://localhost:8080/qurba/api/wishlist/{userId}|View wishlist|
|POST http://localhost:8080/qurba/api/wishlist/{userId}/|Add item to wishlist|
|DELETE http://localhost:8080/qurba/api/wishlist/{userId}/remove?productId={productId}|Remove item|
|DELETE http://localhost:8080/qurba/api/wishlist/{userId}/clear|Clear wishlist|
|POST http://localhost:8080/qurba/api/feedback/{userId}|Submit Feedback|
|GET http://localhost:8080/qurba/api/feedback/{userId}|View Feedback|
|DELETE http://localhost:8080/qurba/api/feedback/{userId}/{feedbackId}|Delete Feedback|

### Role: ADMIN
| Endpoint          | Description          |
|-------------------|----------------------|
|GET  http://localhost:8080/qurba/api/admin/products|Get All Products|
|POST http://localhost:8080/qurba/api/admin/products|Add Product|
|PUT http://localhost:8080/qurba/api/admin/products/{productid}|Update Product|
|DELETE http://localhost:8080/qurba/api/admin/products/{productid}|Delete Product|
|GET http://localhost:8080/qurba/api/admin/orders|Get All Orders|
|PATCH http://localhost:8080/qurba/api/admin/orders/{orderId}/status|Update Order Status|
|GET http://localhost:8080qurba//api/admin/orders/filter?status={status}|Filter Order by status|
|GET http://localhost:8080/qurba/api/admin/orders/by-month?year={year}|Filter Order by Year|
|GET http://localhost:8080/qurba/api/admin/orders/by-month?year={year}&month={month}|Filter Order by Year & Month|
|GET http://localhost:8080/qurba/api/admin/orders/by-date-range?startDate={date&Time}&endDate={date&Time}|Filter Order by Time Range |
|GET http://localhost:8080/qurba/api/reviews/product/{productId}|Fetch all reviews for a product|
|GET http://localhost:8080/qurba/api/admin/feedback|View All Feedback|
|GET http://localhost:8080/qurba/api/admin/feedback/filter?year={year}|Filter feedback by year|
|GET http://localhost:8080/qurba/api/admin/feedback/filter?year={year}&month={month}|Filter feedback by year and month|
|PATCH http://localhost:8080/qurba/api/admin/feedback/{feedbackId}/read|Mark feedback as read|
|POST http://localhost:8080/qurba/api/admin/feedback/{feedbackId}/respond|Response to feedback|

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

#### Update Order Status
**Endpoint:** http://localhost:8080/qurba/api/admin/orders/{orderId}/status
**Instructions:**
1. Replace {orderid} with the actual order ID
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Select Body > raw (JSON)
5. Enter updated product details:
```
{
         "status":  "CONFIRMED"
}

```
6. Available status such as PENDING, CONFIRMED, SHIPPPED, DELIVERED, CANCELED 
7. Send a request to update the order

#### Filter Order by Status
**Endpoint:** http://localhost:8080qurba//api/admin/orders/filter?status={orderStatus}
**Instructions:**
1. Replace {orderStatus} with the actual order status
2. Available status such as PENDING, CONFIRMED, SHIPPPED, DELIVERED, CANCELED 
3. In Postman, select Authorization > Bearer Token
4. Paste the admin login token
5. Send a request to viewing the filtered order by status

#### Filter Order by Time
**Endpoint (Filter by year):** http://localhost:8080/qurba/api/admin/orders/by-month?year={year}
**Endpoint (Filter by year and month):** http://localhost:8080/qurba/api/admin/orders/by-month?year={year}&month={month}
**Endpoint (Filter by time range):** http://localhost:8080/qurba/api/admin/orders/by-date-range?startDate={timeRange}&endDate={timeRange}

**Instructions:**
1. Replace {year} or {mont} with the actual year and month
2. For {timeRange}, replace with format like this
3. http://localhost:8080/qurba/api/admin/orders/by-date-range?startDate=2023-06-01T00:00:00&endDate=2023-06-30T23:59:59
5. In Postman, select Authorization > Bearer Token
6. Paste the admin login token
7. Send a request to view the filtered order by time


#### View all feedback
**Endpoint:** GET http://localhost:8080/qurba/api/admin/feedback
**Instructions:**
1. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Send a request to viewing the view all the feedback

#### FILTER FEEDBACK by YEAR
**Endpoint:** GET http://localhost:8080/qurba/api/admin/feedback/filter?year={year}
**Instructions:**
1. Replace the {year} with actual year
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Send a request to view filtered feedback by year

#### FILTER FEEDBACK by YEAR and MONTH
**Endpoint:** GET http://localhost:8080/qurba/api/admin/feedback/filter?year={year}&month={month}
**Instructions:**
1. Replace the {year} with actual year and {month} with actual month
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Send a request to view filtered feedback by year and month

#### Mark Feedback as Read
**Endpoint:** PATCH http://localhost:8080/qurba/api/admin/feedback/{feedbackId}/read
**Instructions:**
1. Replace the {feedbackid} with actual exisitng feedback id
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Send a request to patch the feedback as read

#### Response to feedback
**Endpoint:** POST http://localhost:8080/qurba/api/admin/feedback/{feedbackId}/respond
**Instructions:**
1. Replace {feedbackid} with the actual order ID
2. In Postman, select Authorization > Bearer Token
3. Paste the admin login token
4. Select Body > raw (JSON)
5. Enter response details:
```
{
  "response": "Thank you for your feedback. We're glad you enjoyed our products!"
}
```
6. Send a request send the response


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

#### View Product reviews
**Endpoint:** GET http://localhost:8080/qurba/api/reviews/product/{productId}
**Instructions:**
1. Replace {productId} with the specific product ID

#### Submit a new review
**Endpoint:** POST http://localhost:8080/qurba/api/reviews/{userId}

**Instructions:**
1. Replace {userID} with the actual login user ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Select Body > raw (JSON)
5. Enter review details:
```sql
{
  "productId": 1,
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```
5. Send request to post the review

#### Edit review
**Endpoint:** PUT http://localhost:8080/qurba/api/reviews/{userId}/{reviewId}

**Instructions:**
1. Replace {userID} with the actual login user ID, and {reviewID} with actual review id
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Select Body > raw (JSON)
5. Enter review details:
```sql
{
  "rating": 4,
  "comment": "Good product, but could be better after more use."
}
```
5. Send request to edit the review

#### View wishlist
**Endpoint:** GET http://localhost:8080/qurba/api/wishlist/{userId}

**Instructions:**
1. Replace {userid} with the actual login userId
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to view wishlist

#### Add item to wishlist
**Endpoint:** POST http://localhost:8080/qurba/api/wishlist/{userId}/add?productId={productId}

**Instructions:**
1. Replace {userid} with the actual login userId and {productid} with actual product id
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to add that item to wishlist

#### Remove specific item from wishlist 
**Endpoint:** DELETE http://localhost:8080/qurba/api/wishlist/{userId}/remove?productId={productId}

**Instructions:**
1. Replace {userid} with the actual login userId and {productid} with actual product id
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to remove that specific item from wishlist

#### Clear all the item from wishlist
**Endpoint:** DELETE http://localhost:8080/qurba/api/wishlist/{userId}/clear

**Instructions:**
1. Replace {userid} with the actual login userId
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to clear all the item from wishlist

#### Send feedback form to admin
**Endpoint:** POST http://localhost:8080/qurba/api/feedback/{userId}

**Instructions:**
1. Replace {userID} with the actual login user ID
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Select Body > raw (JSON)
5. Enter review details:
```sql
{
  "subject": "Product Quality",
  "content": "The spices I ordered were excellent quality!"
}
```
5. Send request to submit the feedback

#### View feedback 
**Endpoint:** GET http://localhost:8080/qurba/api/feedback/{userId}

**Instructions:**
1. Replace {userid} with the actual login userId
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to get the submitted feedback as customer

#### Delete feedback 
**Endpoint:** DELETE http://localhost:8080/qurba/api/feedback/{userId}/{feedbackId}

**Instructions:**
1. Replace {userid} with the actual login userId and the {feedbackID} with actual feedback id
2. In Postman, select Authorization > Bearer Token
3. Paste the customer login token
4. Send request to delete that particular feedback

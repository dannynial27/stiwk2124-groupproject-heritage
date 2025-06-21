[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/co02Vmtr)
## Requirements for Group Project
[Read the instruction](https://github.com/STIWK2124-A242/class-activity-stiwk2124/blob/main/Group_Project_Guideline.md)

## Refer to the link below for the `Group Name` and `Group Members`
https://github.com/STIWK2124-A242/class-activity-stiwk2124/blob/main/NewGroupMembers.md

## Group Info:
1. Matric Number & Name & Photo & Phone Number
1. Mention who the leader is.
1. Mention your group name for Assignment-1 and Assignment-2
1. Other related info (if any)

### 👥 Group Members (Backend)
| Name             | Role    | Matric Number | Phone Number  | Previous Group Name    | Picture                                                                 |
| ---------------- | ------- | ------------- | ------------- | ------- | ----------------------------------------------------------------------- |
| Wong Zhen Xuan  | LEADER & Backend & Frontend Director & Developer | 292567        | 011-10890137  | nezha/nezha2  | <img src="https://github.com/user-attachments/assets/72aed434-0bee-40c0-9409-cb7f02b362c4" width="100"/> |
| Tan Luck Phang  | MEMBER  | 293224        | 011-14438848  | nezha/nezha2  | <img src="https://github.com/user-attachments/assets/92f3d9cc-ef1f-4fd6-83cf-49afa12d4f12" width="100"/> |
| Muhammad Danial Bin Mohd Faris | MEMBER | 294692 | 012-451-6452 | Syntax/Syntax  | <img src="https://github.com/user-attachments/assets/13415d47-f128-427e-842d-fc8b3a27a858" width="100"/> |

### 👥 Group Members (Frontend)
| Name             | Role    | Matric Number | Phone Number  | Previous Group Name    | Picture                                                                 |
| ---------------- | ------- | ------------- | ------------- | ------- | ----------------------------------------------------------------------- |
| Siti Alya Balqis Binti Abdul Rahmat | Backend Driector | 291345 | 012-6552610 | repo-ranger/repo_rangers  | <img src="https://github.com/user-attachments/assets/fc15804a-7338-439f-bfac-09563a223abe" width="100"/> |
| Nurfatin Aleysyah Binti Abdul Razly | MEMBER | 296017 | 019-3766461 | blitzers/blitzer  | <img src="https://github.com/user-attachments/assets/a198b7ab-f8ca-49ea-ac8b-308f0edf4891" width="100"/> |
| Nurul Husna Binti Mohd Badrulisyam | MEMBER | 291878 | 018-4715413 | error404/error404_  | <img src="https://github.com/user-attachments/assets/c72aac99-b1c9-4036-90b0-a401a37cf01d" width="100"/> |
| Ku Hazwan Bin Ku Izham | MEMBER  | 289889 | 019-8442357 | Syntax/Syntax  | <img src="https://github.com/user-attachments/assets/2e82e08a-6a98-4512-8c98-e3ee919eebbb" width="100"/> |

## Title of your application (a unique title)

AmeenMarket : Bridging Tradition with Modern E-Commerce

## Abstract (in 300 words)
   1. Background

       In the rapidly evolving digital landscape, e-commerce has transformed how goods and services are bought and sold globally (Laudon & Traver, 2021). Traditional businesses like Qurba Food Industries, a manufacturer of food and beverage products under the AMEEN brand, are increasingly adopting online platforms to expand market reach and streamline sales processes. These platforms represent not just a technological shift but an opportunity to preserve and promote cultural heritage products while addressing modern market demands (Chauhan et al., 2023).

   3. Problem Statement
    
      The growing e-commerce sector faces challenges in developing efficient online platforms to manage product sales, user interactions, and order processing. Issues of scalability, user experience, and consistent transaction flows require careful consideration (Bhat et al., 2016). Despite increasing global appreciation for cultural diversity and authenticity, existing platforms often fail to adequately showcase heritage products, lacking in product diversity, global reach, and ethical considerations (Chauhan et al., 2023; PilotSprint, 2024).

   4. Main objective

       Our project aims to develop a specialized e-commerce backend using Spring Boot and Java programming language, following the MVC pattern for clear separation of concerns. The platform seeks to create an immersive shopping experience that facilitates transactions while supporting businesses in showcasing their products to a wider audience (Gupta, 2014; Turban et al., 2018).

   6. Methodology
    
      We employ a headless commerce architecture using Spring Boot for backend development with RESTful APIs for all core features and MySQL for data storage, while Angular is used for the frontend to enhance the user interface and experience. Security is enforced using JWT-based authentication and role-based access control (Mărcuță, 2025). The system incorporates secure authentication, comprehensive product management, advanced search and filtering capabilities, product review and rating systems, wishlist functionality, contact feedback forms, and streamlined checkout processes, all containerized with Docker for easy deployment (Goele & Chanana, 2012).

   7. Result

       The implemented platform successfully delivers a robust and fully functional e-commerce backend that supports user registration and authentication for both customers and admins, secure JWT-based access, product catalog management, shopping cart operations, product review and rating capabilities, wishlist management, contact feedback submission, and order processing (Seth & Wadhawan, 2016). The system exposes RESTful APIs for all major features, with role-based access ensuring proper authorization.

   9. Conclusion

       By combining comprehensive e-commerce functionality with modern backend practices, our platform provides a secure, maintainable, and scalable foundation that meets the needs of diverse businesses while supporting future enhancements (Raghunath & Panga, 2013). This project demonstrates how technology can be effectively leveraged to build robust e-commerce solutions that address contemporary market challenges (Gunasekaran et al., 2002).

## Link for Docker Image
[Docker Hub - AmeenQurba- Backend](https://hub.docker.com/r/dannynial27/qurba-backend)

[Docker Hub - AmeenQurba- Frontend](https://hub.docker.com/r/dannynial27/qurba-frontend)
## Instructions on how to run Docker.
### Prerequisites
* Make sure you have Docker Desktop installed and running on your PC.

### Running the Backend

1.  Open the Docker Desktop
2.  Clone / Download the github repository / Download ```docker-compose.yml``` from repository
3.  Use the command to pull everything from docker :
    ```
    docker pull dannynial27/qurba-backend
    ```
5.  Run the Backend services:
    ```
    docker-compose up -d
    ```
    This command will build (if necessary) and start the Spring Boot application, MySQL database, and phpMyAdmin.
6.  Access the Backend services:
    * **Spring Boot Application:**
    * **phpMyAdmin:** `http://localhost:8082` (Login with `root` and password `root` by default)
7.  Stop the Backend services:
    ```
    docker-compose down
    ```

### Running the Frontend

1.  Open the Docker Desktop
2.  Clone / Download the github repository / Download ```docker-compose.yml``` from repository
3.  Use the command to pull everything from docker :
    ```
    docker pull dannynial27/qurba-frontend
    ```
5.  Run the Frontend service:
    ```
    docker-compose up -d
    ```
    This command will build (if necessary) and start your Angular application served by Nginx.
6.  Search `http://localhost:4200` on your web browser for the frontend.
    * **Note:** The frontend will attempt to connect to the backend API (`http://localhost:8080/qurba/api/products`). Ensure the backend services are running before accessing the frontend.
7.  Stop the Frontend service:
    ```
    docker-compose down
    ```

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


## Link for the YouTube Presentation

## Result/Output (Screenshot of the output)

### HOME PAGE (Public||BEFORE USER LOGIN)
![Screenshot (225)](https://github.com/user-attachments/assets/5445dfd3-0dda-41e0-b368-b38b4c97fbb4)
![Screenshot (226)](https://github.com/user-attachments/assets/88470643-394d-49a3-be21-69c377e767c2)
![Screenshot (227)](https://github.com/user-attachments/assets/dc3f47de-db7b-461d-878f-200e81fbb254)
![Screenshot (228)](https://github.com/user-attachments/assets/060ac0ed-7f95-4308-a187-d120e1459287)
![Screenshot (229)](https://github.com/user-attachments/assets/79a08199-efe0-4142-b76c-d40fa4f064a1)
![image](https://github.com/user-attachments/assets/c1be2451-876b-4e43-8bb1-9dc62b43a2bc)

## AUTHENTICATION PAGE
![Screenshot 2025-06-21 204921](https://github.com/user-attachments/assets/bcf567ed-19e3-442b-a74b-60e5e8240d87)
![Screenshot 2025-06-21 204926](https://github.com/user-attachments/assets/0aa240c1-950b-4ab5-bf07-2374e0805666)

## CUSTOMER
### HOME PAGE (AFTER USER LOGIN)
![Screenshot (232)](https://github.com/user-attachments/assets/bd79a94f-9a01-4966-8b61-04835e7315d7)
![Screenshot (233)](https://github.com/user-attachments/assets/2789be11-3668-443c-9439-4b9bfb53a2ef)
![Screenshot (234)](https://github.com/user-attachments/assets/9703dded-858b-4b0d-945f-b636db1086ed)
![Screenshot (236)](https://github.com/user-attachments/assets/b68ac29f-8db1-4672-8c9f-a5161e50d25d)
![Screenshot (237)](https://github.com/user-attachments/assets/fb4c92bb-8146-4e7c-bb01-7e4e0cce0ff8)

### PRODUCT LIST PAGE
![image](https://github.com/user-attachments/assets/77cd5309-a50d-4c65-8184-29e5af6e8ac1)
![image](https://github.com/user-attachments/assets/bc0fba8f-80f4-4722-9355-fc2d9fe31a08)
![image](https://github.com/user-attachments/assets/1c4d6fd9-8382-4fb0-85f8-5c23ffbae61c)
![image](https://github.com/user-attachments/assets/2b4ca741-1a1b-471e-a09d-0708ac3b2b14)

### PRODUCT DETAIL PAGE
![image](https://github.com/user-attachments/assets/7af5f5b1-33c0-4839-b840-de5ec32b71d8)

### PRODUCT REVIEW AND RATING
![image](https://github.com/user-attachments/assets/c50c758f-4f13-491a-9490-2d7ff5902511)
![image](https://github.com/user-attachments/assets/6f879166-19a8-4867-8870-1b72814a6117)

### WISHLIST PAGE
![image](https://github.com/user-attachments/assets/e92c7e34-bcab-411a-944c-8b2346420c77)
![image](https://github.com/user-attachments/assets/8abae512-5a72-4432-8a6f-7356b9bb710d)

### SHOPPING CART PAGE - VIEW CART ITEMS
![image](https://github.com/user-attachments/assets/ac9ca8ce-dc68-4f60-be82-e4403166a22e)

### SHOPPING CART PAGE - UPDATE QUANTITY
![image](https://github.com/user-attachments/assets/55770cf5-9fb8-4ade-9d07-6feee7620435)

### SHOPPING CART PAGE - REMOVE ITEMS
![image](https://github.com/user-attachments/assets/20c2fe45-4fbb-4496-8964-5ba27afa0309)

### Checkout Page
![image](https://github.com/user-attachments/assets/f690e5d1-7b08-4884-8abb-462821f6885a)

### Orders Success Page
![image](https://github.com/user-attachments/assets/65bd92ac-1d53-4cd8-8963-0f1285675888)

### My Orders Page
![image](https://github.com/user-attachments/assets/3b8082a8-fc67-4d6a-a9d1-3f1ea4929644)

### FEEDBACK FORM (USER)
#### Feedback Form - Submit Feedback
![Screenshot (246)](https://github.com/user-attachments/assets/ae1848e9-704b-46e5-bddd-25dd35b1b7ef)
![image](https://github.com/user-attachments/assets/e1e52709-ef36-4365-a858-42653822b00d)
![image](https://github.com/user-attachments/assets/f64df1b5-c1d9-4f4e-b07f-e542c409381e)

#### Feedback Form - My Feedback (History)
![Screenshot (250)](https://github.com/user-attachments/assets/ff44d4a0-526d-4b02-b48f-09122f76ba12)
![Screenshot (247)](https://github.com/user-attachments/assets/3b87e4fe-e910-428c-abbd-00c1d949ce8a)

### FEEDBACK VIEWER (ADMIN)
![Screenshot (240)](https://github.com/user-attachments/assets/3ec23449-fa5f-4da1-9b8f-cf59a1545050)
![Screenshot (241)](https://github.com/user-attachments/assets/5d7890f4-6cb3-477e-9655-b67b95604b06)
![Screenshot (242)](https://github.com/user-attachments/assets/3a9035c4-72dc-453d-b272-c10741308513)
![Screenshot (243)](https://github.com/user-attachments/assets/e7700c40-d16e-496a-9aa3-041fc82c7bdb)
![Screenshot (244)](https://github.com/user-attachments/assets/d2ab6cd9-544f-4c56-b04e-54d67e36f95c)

## ADMIN
### ADMIN PRODUCT PAGE -CRUD
#### Manage product - All product
![image](https://github.com/user-attachments/assets/b3c450e0-c610-4647-9b71-a17afc00c656)
![image](https://github.com/user-attachments/assets/b5906dcc-188e-410e-8797-1c8ffac01b82)
![image](https://github.com/user-attachments/assets/90c4d392-7d0c-488d-bcbe-387ca3f270c9)
![image](https://github.com/user-attachments/assets/7c1dd3bc-f6af-4293-8cca-dd4e12841f94)

#### Manage product - Manage by Categories
![image](https://github.com/user-attachments/assets/6395ae74-3f49-4cbb-bd1f-d39d74ceaca8)
![image](https://github.com/user-attachments/assets/0b8003bb-cbf8-470f-980c-9f35c32e0169)
![image](https://github.com/user-attachments/assets/59444252-8f35-40fa-987a-d9c76fc61e20)

#### Manage product - Add new product
![image](https://github.com/user-attachments/assets/49451f57-b6cd-4498-a11a-8d53af742afd)

### Admin Manage Orders Page
![image](https://github.com/user-attachments/assets/1cd3bf9c-1993-456b-9563-73493e5a257f)
![WhatsApp Image 2025-06-20 at 22 21 53_1a395629](https://github.com/user-attachments/assets/0d82cfaf-4164-4396-adaf-d559ebbabbcc)

## References (Not less than 20)

Chauhan, H., Yadav, D., Balaji, T., Kumar, M., & Bhosale, T. (2023). Creating A Distinctive E-Commerce Platform For Cultural Heritage Products: A Visionary Venture. International Journal of Creative Research Thoughts (IJCRT), 11(5), 683-694.

Sharma, A. (2013). A study on E-commerce and Online Shopping: Issues and Influences. International Journal of Computer Engineering and Technology, 4(1), 364-376.

Mitra, A. (2013). E-Commerce in India-A review. International Journal of Marketing, Financial Services & Management Research, 2(2), 126-132.

Chanana, N., & Goele, S. (2012). Future of E-commerce in India. International Journal of Computing & Business Research, 2229-6166.

Ray, S. (2011). Emerging Trends of E-commerce in India: Some Crucial Issues Prospects and Challenges. Computer Engineering and Intelligent Systems, 2(5), 17-35.

Seth, A., & Wadhawan, S. (2016). Technology revolutionizing retail practices in digital era. International Journal of Recent Research Aspects, 3(1), 67-72.

Shahjee, R. (2016). The Impact of Electronic Commerce on Business Organization. Scholarly Research Journal for Interdisciplinary Studies, 4(27), 3130-3140.

Shettar, R. M. (2016). Emerging trends of E-commerce in India: An empirical study. International Journal of Business and Management Invention, 5(9), 25-31.

Goele, S., & Chanana, N. (2012). Mobile Commerce in India: Promises and Problems. International Journal of Computer Science and Management Studies, 12(2), 298-302.

PilotSprint. (2024). Enhanced E-Commerce for Cultural Heritage: Timeless Traditions by Harsiddhi. Retrieved from https://www.pilotsprint.com/case-studies/timeless-traditions-ecommerce-transformation

Whartibus. (2022). World Heritage Crafts Marketplace. Retrieved from https://whartibus.com/

Gunasekaran, A., Marri, H., McGaughey, R., & Nebhwani, M. (2002). E-commerce and its impact on operations management. International Journal of Production Economics, 75(1-2), 185-197.

Gupta, A. (2014). E-Commerce: Role of E-Commerce in Today's Business. International Journal of Computing and Corporate Research, 4(1), 1-8.

Numberger, S., & Renhank, C. (2005). The Future of B2C E-Commerce. Electronic Markets, 15(4), 269-282.

Raghunath, A., & Panga, M. D. (2013). Problem and Prospects of E-Commerce. International Journal of Research and Development - A Management Review, 2(1), 59-68.

Fadatare, R. (2025, April 18). Spring Boot Microservices E-Commerce Project: Step-by-Step Guide. Medium. https://rameshfadatare.medium.com/in-this-tutorial-we-will-create-a-simple-e-commerce-application-using-a-microservices-architecture-a51214921faa

Laudon, K. C., & Traver, C. G. (2021). E-commerce: Business, Technology, Society (16th ed.). Pearson.

Chaffey, D. (2020). Digital Business and E-commerce Management: Strategy, Implementation and Practice (7th ed.). Pearson.

Turban, E., Outland, J., King, D., Lee, J. K., Liang, T. P., & Turban, D. C. (2018). Electronic Commerce 2018: A Managerial and Social Networks Perspective (9th ed.). Springer.

Mărcuță, C. (2025, June 12). Protect REST APIs with Spring Security - A Practical Approach. MoldStud - Custom Software Development Company. https://moldstud.com/articles/p-protect-rest-apis-with-spring-security-a-practical-approach

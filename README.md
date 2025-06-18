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
| Name             | Role    | Matric Number | Phone Number  | Picture                                                                 |
| ---------------- | ------- | ------------- | ------------- | ----------------------------------------------------------------------- |
| Wong Zhen Xuan  | LEADER & Frontend Director | 292567        | 011-10890137  | <img src="https://github.com/user-attachments/assets/72aed434-0bee-40c0-9409-cb7f02b362c4" width="100"/> |
| Tan Luck Phang  | MEMBER  | 293224        | 011-14438848  | <img src="https://github.com/user-attachments/assets/92f3d9cc-ef1f-4fd6-83cf-49afa12d4f12" width="100"/> |
| Muhammad Danial Bin Mohd Faris | MEMBER | 294692 | 012-451-6452 | <img src="https://github.com/user-attachments/assets/13415d47-f128-427e-842d-fc8b3a27a858" width="100"/> |

### 👥 Group Members (Frontend)
| Name             | Role    | Matric Number | Phone Number  | Picture                                                                 |
| ---------------- | ------- | ------------- | ------------- | ----------------------------------------------------------------------- |
| Siti Alya Balqis Binti Abdul Rahmat | Backend Driector | 291345 | 012-655-2610 ||
| Nurfatin Aleysyah Binti Abdul Razly | MEMBER | 296017 | 019-376-6461 | <img src="https://github.com/user-attachments/assets/a198b7ab-f8ca-49ea-ac8b-308f0edf4891" width="100"/> |
| Nurul Husna Binti Mohd Badrulisyam | MEMBER | 291878 | 018-471-5413 | <img src="https://github.com/user-attachments/assets/c72aac99-b1c9-4036-90b0-a401a37cf01d" width="100"/> |
| Ku Hazwan Bin Ku Izham | MEMBER  | 289889 | 019-844-2357 | <img src="https://github.com/user-attachments/assets/2e82e08a-6a98-4512-8c98-e3ee919eebbb" width="100"/> |

## Title of your application (a unique title)

AmeenMarket : Bridging Tradition with Modern E-Commerce

## Abstract (in 300 words)
   1. Background
      In the rapidly evolving digital landscape, e-commerce has transformed how goods and services are bought and sold globally (Laudon & Traver, 2021). Traditional businesses like Qurba Food Industries, a manufacturer of food and beverage products under the AMEEN brand, are increasingly adopting online platforms to expand market reach and streamline sales processes. These platforms represent not just a technological shift but an opportunity to preserve and promote cultural heritage products while addressing modern market demands (Chauhan et al., 2023).

   2. Problem Statement
      The growing e-commerce sector faces challenges in developing efficient online platforms to manage product sales, user interactions, and order processing. Issues of scalability, user experience, and consistent transaction flows require careful consideration (Bhat et al., 2016). Despite increasing global appreciation for cultural diversity and authenticity, existing platforms often fail to adequately showcase heritage products, lacking in product diversity, global reach, and ethical considerations (Chauhan et al., 2023; PilotSprint, 2024).

   3. Main objective
      Our project aims to develop a specialized e-commerce backend using Spring Boot and Java programming language, following the MVC pattern for clear separation of concerns. The platform seeks to create an immersive shopping experience that facilitates transactions while supporting businesses in showcasing their products to a wider audience (Gupta, 2014; Turban et al., 2018).

   4. Methodology
      We employ a headless commerce architecture using Spring Boot for backend development with RESTful APIs for all core features and MySQL for data storage, while Angular is used for the frontend to enhance the user interface and experience. Security is enforced using JWT-based authentication and role-based access control (Mărcuță, 2025). The system incorporates secure authentication, comprehensive product management, advanced search and filtering capabilities, product review and rating systems, wishlist functionality, contact feedback forms, and streamlined checkout processes, all containerized with Docker for easy deployment (Goele & Chanana, 2012).

   5. Result
      The implemented platform successfully delivers a robust and fully functional e-commerce backend that supports user registration and authentication for both customers and admins, secure JWT-based access, product catalog management, shopping cart operations, product review and rating capabilities, wishlist management, contact feedback submission, and order processing (Seth & Wadhawan, 2016). The system exposes RESTful APIs for all major features, with role-based access ensuring proper authorization.

   6. Conclusion
      By combining comprehensive e-commerce functionality with modern backend practices, our platform provides a secure, maintainable, and scalable foundation that meets the needs of diverse businesses while supporting future enhancements (Raghunath & Panga, 2013). This project demonstrates how technology can be effectively leveraged to build robust e-commerce solutions that address contemporary market challenges (Gunasekaran et al., 2002).

## Link for Docker Image

## Instructions on how to run Docker.

## List of all the endpoints
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
None
```

## Link for the YouTube Presentation

## Result/Output (Screenshot of the output)

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

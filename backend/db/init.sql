-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Jun 05, 2025 at 04:46 AM
-- Server version: 8.0.42
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qurbadb`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 8, '2025-06-05 02:05:29', '2025-06-05 02:05:29'),
(3, 11, '2025-06-05 02:48:39', '2025-06-05 02:48:39');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` bigint NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('PENDING','READ','RESPONDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `admin_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`feedback_id`, `user_id`, `subject`, `content`, `status`, `admin_response`, `created_at`, `responded_at`) VALUES
(1, 1, 'Product Quality Feedback', 'The saffron I purchased was excellent quality!', 'RESPONDED', 'Thank you for your feedback. We\'re glad you enjoyed our products!', '2025-06-05 04:19:41', '2025-06-05 04:28:30'),
(3, 11, 'Product Quality Feedback by ziwen2', 'The saffron I purchased was excellent quality!', 'PENDING', NULL, '2025-06-05 04:24:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `order_date`, `updated_at`) VALUES
(1, 8, 54.00, 'CONFIRMED', '2025-06-05 02:06:19', '2025-06-05 03:32:55');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 1, 2, 27.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` bigint NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`, `updated_at`, `image_path`) VALUES
(1, 'Saffron ZAFA\'RAN', 'Premium saffron threads', 27.00, 'Lain-lain', 18, '2025-05-03 10:24:54', '2025-06-05 02:06:19', 'assets/QurbaProductPhoto/Lain-lain/Saffron ZAFA\'RAN.png'),
(2, 'Minyak Bidara - 120ML', 'Pure bidara oil, 120ml', 55.00, 'Lain-lain', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Lain-lain/Minyak Bidara - 120ML.png'),
(3, 'Minyak Bidara - 45ML', 'Pure bidara oil, 45ml', 35.00, 'Lain-lain', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Lain-lain/Minyak Bidara - 45ML.png'),
(4, 'MADU MINDA', 'Natural honey for brain health', 45.00, 'Madu', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Madu/MADU MINDA.png'),
(5, 'LI KHAMSATUN', 'Premium blended honey', 58.00, 'Madu', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Madu/LI KHAMSATUN.png'),
(6, 'Perisa Sup', 'Saffron-infused soup noodles', 14.00, 'Mee', 20, '2025-05-03 10:24:54', '2025-05-26 07:51:12', 'assets/QurbaProductPhoto/Mee/Perisa Sup.png'),
(7, 'Perisa Tomyam ODEEN', 'Spicy tomyam saffron noodles', 14.00, 'Mee', 20, '2025-05-03 10:24:54', '2025-05-26 07:51:12', 'assets/QurbaProductPhoto/Mee/Perisa Tomyam ODEEN.png'),
(8, 'Perisa Kari', 'Rich curry saffron noodles', 14.00, 'Mee', 20, '2025-05-03 10:24:54', '2025-05-26 07:51:12', 'assets/QurbaProductPhoto/Mee/Perisa Kari.png'),
(9, 'KOPI IBNU SINA', 'Traditional Arabic coffee blend', 23.00, 'Minuman', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Minuman/Kopi Ibnu Sina.png'),
(10, 'TEH IBNU SINA', 'Herbal tea with saffron', 24.00, 'Minuman', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Minuman/Teh Ibnu Sina.png'),
(11, 'Khal Tanpa Herba - 500 ML', 'Pure vinegar, 500ml', 40.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Khal Tanpa Herba - 500 ML.png'),
(12, 'Khal Dengan Herba - 500 ML', 'Herbal vinegar, 500ml', 60.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Khal Dengan Herba - 500 ML.png'),
(13, 'Khal Dengan Herba - 1LITER', 'Herbal vinegar, 1 liter', 95.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Khal Dengan Herba - 1LITER.png'),
(14, 'Serbuk Perencah Penyedap Burger', 'Burger seasoning powder', 5.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Serbuk Perencah Penyedap Burger.png'),
(15, 'Chili Giling', 'Ground chili paste', 3.00, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Chili Giling.png'),
(16, 'Asam Jawa Plus', 'Tamarind sauce with spices', 4.30, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Asam Jawa Plus.png'),
(17, 'Sos Lada Hitam - 1KG', 'Black pepper sauce, 1kg', 5.50, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Lada Hitam - 1KG.png'),
(18, 'Sos Lada Hitem - 340g', 'Black pepper sauce, 340g', 3.80, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Lada Hitem - 340g.png'),
(19, 'Sos Tiram - 340g', 'Oyster sauce, 340g', 3.80, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Tiram - 340g.png'),
(20, 'Sos Cili Burger - 340g', 'Chili sauce for burgers, 340g', 3.00, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Cili Burger - 340g.png'),
(21, 'Kuah Rojak Madu - 400g', 'Honey rojak sauce, 400g', 5.50, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Kuah Rojak Madu - 400g.png');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint NOT NULL,
  `role_name` enum('ADMIN','CUSTOMER') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'ADMIN'),
(2, 'CUSTOMER');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `role_id` bigint NOT NULL DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `updated_at`, `enabled`, `role_id`) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$f7Q7k6weJ09nvQdzvExD9O55LzkKvNPCRWDVDWV/oMMU2s3aGMpd.', '2025-04-19 23:39:37', '2025-05-03 10:21:53', 1, 1),
(5, 'Admin101', 'admin123@gmail.com', '$2a$10$6k3qA4p1NYnfKHBaYcMJD.1jMufmOdeoNHgNak0LL9Jw8W4GZBAxK', '2025-05-07 23:58:21', '2025-05-07 23:58:21', 1, 1),
(6, 'AdamYau', 'adamyau@gmail.com', '$2a$10$wCBT0ClVdoHmMGHT7U/RiOwi5lAM45BYsmCgLw9N4hyjS9pwBtT6O', '2025-05-08 03:19:44', '2025-05-08 03:19:44', 1, 2),
(7, 'admin123', 'admin123@example.com', '$2a$10$xgbhj5ugt8XJzOI1juKpQefNtRe.m/x9ETcmbJSkyqzPfUWSthrKq', '2025-06-05 01:59:22', '2025-06-05 01:59:22', 1, 1),
(8, 'customer', 'customer123@example.com', '$2a$10$0xxDQdOPs2r8YUOotYvAAeM/w4SSZ31qN5vkn.8pvAlhmKwvSfkk2', '2025-06-05 02:02:29', '2025-06-05 02:02:29', 1, 2),
(11, 'ziwen', 'ziwen1234@gmail.com', '$2a$10$hY.1pOl3itAr5MZgrb.Pg.vklStrOkxfa2r7yfPD84oCRIyc6cV8S', '2025-06-05 02:48:25', '2025-06-05 02:48:25', 1, 2),
(12, 'wenuxTyler', 'tyler1234@gmail.com', '$2a$10$I8woOoKHn4Qrvu2s6rNz3O4HeGwkqz4/pY9oRUmGhQs3YYcAI2Bdy', '2025-06-05 02:53:49', '2025-06-05 02:53:49', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_ibfk_1` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

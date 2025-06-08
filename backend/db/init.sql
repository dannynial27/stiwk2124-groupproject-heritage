-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2025 at 08:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `cart_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
  `cart_item_id` bigint(20) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `status` enum('PENDING','READ','RESPONDED') NOT NULL DEFAULT 'PENDING',
  `admin_response` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
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
  `order_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `shipping_name` varchar(100) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_postal_code` varchar(20) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `order_date`, `updated_at`, `shipping_name`, `shipping_address`, `shipping_city`, `shipping_postal_code`, `payment_method`) VALUES
(1, 8, 54.00, 'CONFIRMED', '2025-06-05 02:06:19', '2025-06-05 03:32:55', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
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
  `product_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
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
-- Stand-in structure for view `product_review_stats`
-- (See below for the actual view)
--
CREATE TABLE `product_review_stats` (
`product_id` bigint(20)
,`product_name` varchar(100)
,`review_count` bigint(21)
,`average_rating` decimal(14,4)
,`five_star_count` decimal(22,0)
,`four_star_count` decimal(22,0)
,`three_star_count` decimal(22,0)
,`two_star_count` decimal(22,0)
,`one_star_count` decimal(22,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 13, 1, 5, 'Amazing product! Highly recommended!', '2025-06-06 04:49:09', '2025-06-06 04:49:09'),
(3, 13, 3, 3, 'Average product, could be better', '2025-06-06 05:13:42', '2025-06-06 05:13:42');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint(20) NOT NULL,
  `role_name` enum('ADMIN','CUSTOMER') NOT NULL
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
  `user_id` bigint(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `role_id` bigint(20) NOT NULL DEFAULT 2
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
(12, 'wenuxTyler', 'tyler1234@gmail.com', '$2a$10$I8woOoKHn4Qrvu2s6rNz3O4HeGwkqz4/pY9oRUmGhQs3YYcAI2Bdy', '2025-06-05 02:53:49', '2025-06-05 02:53:49', 1, 1),
(13, 'testcustomer', 'test@example.com', '$2a$10$ELqei90KEpl5SAiFZJCwO.o5qVPpyyYets1SbHt7T5gbNxuWFwAXy', '2025-06-06 04:18:02', '2025-06-06 04:18:02', 1, 2);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_wishlist_summary`
-- (See below for the actual view)
--
CREATE TABLE `user_wishlist_summary` (
`user_id` bigint(20)
,`username` varchar(50)
,`wishlist_item_count` bigint(21)
,`wishlist_created_at` timestamp
,`wishlist_updated_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `wishlist_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`wishlist_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 13, '2025-06-06 05:23:16', '2025-06-06 05:23:16');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `wishlist_item_id` bigint(20) NOT NULL,
  `wishlist_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `product_review_stats`
--
DROP TABLE IF EXISTS `product_review_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `product_review_stats`  AS SELECT `p`.`product_id` AS `product_id`, `p`.`name` AS `product_name`, count(`r`.`review_id`) AS `review_count`, coalesce(avg(`r`.`rating`),0) AS `average_rating`, coalesce(sum(case when `r`.`rating` = 5 then 1 else 0 end),0) AS `five_star_count`, coalesce(sum(case when `r`.`rating` = 4 then 1 else 0 end),0) AS `four_star_count`, coalesce(sum(case when `r`.`rating` = 3 then 1 else 0 end),0) AS `three_star_count`, coalesce(sum(case when `r`.`rating` = 2 then 1 else 0 end),0) AS `two_star_count`, coalesce(sum(case when `r`.`rating` = 1 then 1 else 0 end),0) AS `one_star_count` FROM (`products` `p` left join `reviews` `r` on(`p`.`product_id` = `r`.`product_id`)) GROUP BY `p`.`product_id`, `p`.`name` ;

-- --------------------------------------------------------

--
-- Structure for view `user_wishlist_summary`
--
DROP TABLE IF EXISTS `user_wishlist_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_wishlist_summary`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`username` AS `username`, count(`wi`.`wishlist_item_id`) AS `wishlist_item_count`, `w`.`created_at` AS `wishlist_created_at`, `w`.`updated_at` AS `wishlist_updated_at` FROM ((`users` `u` left join `wishlists` `w` on(`u`.`user_id` = `w`.`user_id`)) left join `wishlist_items` `wi` on(`w`.`wishlist_id` = `wi`.`wishlist_id`)) GROUP BY `u`.`user_id`, `u`.`username`, `w`.`created_at`, `w`.`updated_at` ;

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
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  ADD KEY `idx_product_reviews` (`product_id`),
  ADD KEY `idx_user_reviews` (`user_id`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_reviews_product_rating` (`product_id`,`rating`),
  ADD KEY `idx_reviews_user_created` (`user_id`,`created_at`);

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
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `unique_user_wishlist` (`user_id`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`wishlist_item_id`),
  ADD UNIQUE KEY `unique_wishlist_product` (`wishlist_id`,`product_id`),
  ADD KEY `idx_wishlist_items` (`wishlist_id`),
  ADD KEY `idx_product_wishlists` (`product_id`),
  ADD KEY `idx_added_at` (`added_at`),
  ADD KEY `idx_wishlist_items_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `wishlist_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `wishlist_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`wishlist_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

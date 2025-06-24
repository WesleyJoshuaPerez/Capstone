-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2025 at 08:29 AM
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
-- Database: `lynx`
--

-- --------------------------------------------------------

--
-- Table structure for table `approved_user`
--

CREATE TABLE `approved_user` (
  `user_id` varchar(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `subscription_plan` varchar(50) NOT NULL,
  `currentBill` int(11) NOT NULL,
  `last_payment_date` date DEFAULT NULL,
  `payment_status` enum('paid','unpaid') DEFAULT 'unpaid',
  `fullname` varchar(200) NOT NULL,
  `birth_date` date NOT NULL,
  `address` varchar(300) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `id_type` varchar(50) NOT NULL,
  `id_number` varchar(50) NOT NULL,
  `id_photo` varchar(255) NOT NULL,
  `proof_of_residency` varchar(255) NOT NULL,
  `home_ownership_type` varchar(100) NOT NULL,
  `installation_date` date NOT NULL,
  `registration_date` date NOT NULL,
  `address_latitude` decimal(10,6) DEFAULT NULL,
  `address_longitude` decimal(10,6) DEFAULT NULL,
  `nap_box_id` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approved_user`
--

INSERT INTO `approved_user` (`user_id`, `username`, `password`, `subscription_plan`, `currentBill`, `last_payment_date`, `payment_status`, `fullname`, `birth_date`, `address`, `contact_number`, `email_address`, `id_type`, `id_number`, `id_photo`, `proof_of_residency`, `home_ownership_type`, `installation_date`, `registration_date`, `address_latitude`, `address_longitude`, `nap_box_id`) VALUES
('0000000002', 'AKrezada202', 'b2c5193ae7cafb6cb6261eeb33f61a1f', 'Gold', 1799, NULL, 'unpaid', 'ANGELINE KATE REZADA', '2003-11-20', 'wawa, Orion, Bataan', '0905-462-7399', 'katerezada0120@gmail.com', 'Postal-ID', '', 'id_picture.png', 'id_picture.png', 'Rented', '2025-05-27', '2025-05-12', 14.623204, 120.583979, NULL),
('0000000003', 'WJperez173', '293f7df8a0c35abaff02998d94d15fd3', 'Gold', 0, '2025-05-14', 'paid', 'WESLEY JOSHUA PEREZ', '2004-03-17', 'bilolo, Orion, Bataan', '0912-868-9551', 'wesleyjoshuaperez.iskolar@gmail.com', 'Drivers-License', '', 'id.png', 'A2.jpg', 'Owned', '2025-05-17', '2025-05-12', 14.612382, 120.561901, NULL),
('0000000004', 'Aheramis074', 'ec53253155cfb518af076a612bf16301', 'Silver', 1499, NULL, 'unpaid', 'APRIL HERAMIS', '2007-05-07', 'sabatan, Orion, Bataan', '0934-897-3489', 'perezwesley17@gmail.com', 'Drivers-License', '', 'testid.jpg', 'gcash.png', 'Rented', '2025-05-26', '2025-05-14', 14.615030, 120.568467, NULL),
('0000000005', 'Tmendoza045', '84a2c5dd30a4d777aeb1cd251c61e9d7', 'Silver', 1499, NULL, 'unpaid', 'TROY MENDOZA', '2007-06-04', 'sabatan, Orion, Bataan', '0923-929-3872', 'sojori6529@finfave.com', 'Drivers-License', '0312123456', 'gundam.png', 'wallpaper.jpg', 'Rented', '2025-07-11', '2025-06-23', 14.614992, 120.567946, '0000000005');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approved_user`
--
ALTER TABLE `approved_user`
  ADD PRIMARY KEY (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

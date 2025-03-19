-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2025 at 09:10 AM
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
-- Table structure for table `admin_lynx`
--

CREATE TABLE `admin_lynx` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_lynx`
--

INSERT INTO `admin_lynx` (`admin_id`, `username`, `password`, `full_name`, `email_address`, `phone`, `created_at`) VALUES
(1, 'wesleyperez', 'adminsuper17', 'Wesley Joshua Perez', 'wjhperez@bpsu.edu.ph', '09300864398', '2025-03-10 03:54:22');

-- --------------------------------------------------------

--
-- Table structure for table `approved_user`
--

CREATE TABLE `approved_user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `subscription_plan` varchar(50) NOT NULL,
  `currentBill` int(11) NOT NULL,
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
  `registration_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approved_user`
--

INSERT INTO `approved_user` (`user_id`, `username`, `password`, `subscription_plan`, `currentBill`, `fullname`, `birth_date`, `address`, `contact_number`, `email_address`, `id_type`, `id_number`, `id_photo`, `proof_of_residency`, `home_ownership_type`, `installation_date`, `registration_date`) VALUES
(15, 'WJperez01', 'wesperez17', 'bronze', 1199, 'WESLEY JOSHUA PEREZ', '2007-03-01', 'duale, limay, bataan', '09380868921', 'wesleyjoshuaperez@gmail.com', 'passport', '', 'idexample.jfif', 'por.jpg', 'Owned', '2025-03-23', '2025-03-09'),
(16, 'Wperez jr14', 'Znx!lh9E', 'silver', 1499, 'WILFREDO PEREZ JR', '1970-12-14', 'bilolo, orion, bataan', '09389234373', 'wilfredoperez@gmail.com', 'drivers-license', '', 'davidid.jfif', 'residency.png', 'Owned', '2025-03-16', '2025-03-19'),
(17, 'Spaclaon01', 'sebastian12', 'gold', 1799, 'SEBASTIAN PACLAON', '2007-03-01', 'duale, limay, bataan', '09380868921', 'wesleyjoshuaperez.iskolar@gmail.com', 'passport', '', 'davidid.jfif', 'por.jpg', 'Rented', '2025-03-17', '2025-03-09');

-- --------------------------------------------------------

--
-- Table structure for table `lynx_technicians`
--

CREATE TABLE `lynx_technicians` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('Installer','Repair Technician') NOT NULL,
  `contact` varchar(20) NOT NULL,
  `status` enum('Available','Busy','On Leave') DEFAULT 'Available',
  `profile_image` varchar(255) DEFAULT 'default_profile.jpg',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lynx_technicians`
--

INSERT INTO `lynx_technicians` (`id`, `name`, `role`, `contact`, `status`, `profile_image`, `created_at`) VALUES
(1, 'John Doe', 'Installer', '09123456789', 'Available', 'john_doe.png', '2025-03-19 06:47:27'),
(2, 'Jane Smith', 'Repair Technician', '09234567890', 'Busy', 'jane_smith.png', '2025-03-19 06:47:27'),
(3, 'Michael Johnson', 'Installer', '09345678901', 'On Leave', 'michael_johnson.png', '2025-03-19 06:47:27'),
(4, 'Emily Davis', 'Repair Technician', '09456789012', 'Available', 'emily_davis.png', '2025-03-19 06:47:27'),
(5, 'Robert Brown', 'Installer', '09567890123', 'Available', 'robert_brown.png', '2025-03-19 06:47:27');

-- --------------------------------------------------------

--
-- Table structure for table `registration_acc`
--

CREATE TABLE `registration_acc` (
  `id` int(11) NOT NULL,
  `subscription_plan` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email_address` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `id_type` varchar(50) DEFAULT NULL,
  `id_number` varchar(50) DEFAULT NULL,
  `id_photo` varchar(255) DEFAULT NULL,
  `home_ownership_type` enum('Owned','Rented') DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `municipality` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `proof_of_residency` varchar(255) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `terms_agreed` varchar(10) NOT NULL DEFAULT 'Unchecked',
  `data_processing_consent` varchar(10) NOT NULL DEFAULT 'Unchecked',
  `id_photo_consent` varchar(10) NOT NULL DEFAULT 'Unchecked',
  `status` varchar(20) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registration_acc`
--

INSERT INTO `registration_acc` (`id`, `subscription_plan`, `first_name`, `last_name`, `contact_number`, `email_address`, `birth_date`, `id_type`, `id_number`, `id_photo`, `home_ownership_type`, `province`, `municipality`, `barangay`, `proof_of_residency`, `installation_date`, `registration_date`, `terms_agreed`, `data_processing_consent`, `id_photo_consent`, `status`) VALUES
(15, 'bronze', 'WESLEY JOSHUA', 'PEREZ', '09380868921', 'wesleyjoshuaperez@gmail.com', '2007-03-01', 'passport', '', 'idexample.jfif', 'Owned', 'bataan', 'limay', 'duale', 'por.jpg', '2025-03-23', '2025-03-02 11:05:58', 'Checked', 'Checked', 'Checked', 'Approved'),
(16, 'silver', 'WILFREDO', 'PEREZ JR', '09389234373', 'wilfredoperez@gmail.com', '1970-12-14', 'drivers-license', '', 'davidid.jfif', 'Owned', 'bataan', 'orion', 'bilolo', 'residency.png', '2025-03-16', '2025-03-02 12:57:33', 'Checked', 'Checked', 'Checked', 'Approved'),
(17, 'gold', 'SEBASTIAN', 'PACLAON', '09380868921', 'wesleyjoshuaperez.iskolar@gmail.com', '2007-03-01', 'passport', '', 'davidid.jfif', 'Rented', 'bataan', 'limay', 'duale', 'por.jpg', '2025-03-17', '2025-03-04 04:14:44', 'Checked', 'Checked', 'Checked', 'Approved'),
(18, 'silver', 'TROY', 'MENDOZA', '09300864398', 'troymendoza@gmail.com', '2007-03-04', 'drivers-license', '', 'davidid.jfif', 'Rented', 'bataan', 'orion', 'sto.-domingo', 'residency.png', '2025-03-24', '2025-03-19 01:49:58', 'Checked', 'Checked', 'Checked', 'Denied');

-- --------------------------------------------------------

--
-- Table structure for table `resetpass_request`
--

CREATE TABLE `resetpass_request` (
  `id` int(11) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resetpass_request`
--

INSERT INTO `resetpass_request` (`id`, `reset_token`, `email_address`, `request_date`, `user_id`, `role`) VALUES
(1, '9SV0TCD1LF', 'wesleyjoshuaperez@gmail.com', '2025-03-05 05:59:29', 15, 'user'),
(2, '8A3Y49B5QK', 'wesleyjoshuaperez@gmail.com', '2025-03-09 02:08:02', 15, 'user'),
(3, 'M70BN2Z5VR', 'wesleyjoshuaperez@gmail.com', '2025-03-09 02:08:38', 15, 'user'),
(4, 'WTCRK7A0NX', 'wesleyjoshuaperez@gmail.com', '2025-03-09 02:17:40', 15, 'user'),
(5, '8HFA7C4TJO', 'wesleyjoshuaperez@gmail.com', '2025-03-09 02:50:33', 15, 'user'),
(6, '64F0DMSCZV', 'wesleyjoshuaperez@gmail.com', '2025-03-09 02:54:08', 15, 'user'),
(7, 'SUXTGYO8IA', 'wesleyjoshuaperez@gmail.com', '2025-03-09 04:06:29', 15, 'user'),
(8, 'T5GAI4JNHP', 'wesleyjoshuaperez@gmail.com', '2025-03-09 04:08:33', 15, 'user'),
(9, '2O3HK6C9TZ', 'wesleyjoshuaperez@gmail.com', '2025-03-09 04:10:24', 15, 'user'),
(10, 'F4KXISGVW1', 'wesleyjoshuaperez@gmail.com', '2025-03-09 21:13:50', 15, 'user'),
(11, 'PBQ9K1YV5J', 'wesleyjoshuaperez@gmail.com', '2025-03-09 21:21:20', 15, 'user'),
(12, '4AWSB7ETVX', 'wjhperez@bpsu.edu.ph', '2025-03-09 21:21:39', 1, 'admin'),
(13, 'VU5OIWGKQD', 'wjhperez@bpsu.edu.ph', '2025-03-09 21:22:15', 1, 'admin'),
(14, '4MV1QBJR8H', 'wesleyjoshuaperez@gmail.com', '2025-03-09 21:23:06', 15, 'user'),
(15, '7FN3MUWQPZ', 'wesleyjoshuaperez@gmail.com', '2025-03-09 21:24:50', 15, 'user'),
(16, '5ZFEO27AHX', 'wesleyjoshuaperez@gmail.com', '2025-03-09 21:25:40', 15, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_lynx`
--
ALTER TABLE `admin_lynx`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email_address`);

--
-- Indexes for table `approved_user`
--
ALTER TABLE `approved_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration_acc`
--
ALTER TABLE `registration_acc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_lynx`
--
ALTER TABLE `admin_lynx`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

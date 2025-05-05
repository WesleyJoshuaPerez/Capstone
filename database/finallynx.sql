-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2025 at 04:46 AM
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
  `address_longitude` decimal(10,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approved_user`
--

INSERT INTO `approved_user` (`user_id`, `username`, `password`, `subscription_plan`, `currentBill`, `last_payment_date`, `payment_status`, `fullname`, `birth_date`, `address`, `contact_number`, `email_address`, `id_type`, `id_number`, `id_photo`, `proof_of_residency`, `home_ownership_type`, `installation_date`, `registration_date`, `address_latitude`, `address_longitude`) VALUES
('0000000001', 'AKrezada201', '70a061892c3eb147f8c06e95c3067899', 'Bronze', 0, '2025-05-05', 'paid', 'ANGELINE KATE REZADA', '2003-11-20', 'sto.-domingo, Orion, Bataan', '0905-462-7399', 'katerezada0120@gmail.com', 'UMID', '', 'erd lynx.jpg', 'erd lynx.jpg', 'Owned', '2025-07-09', '2025-04-28', 14.676538, 120.546253),
('0000000002', 'Karki112', 'd700b6b261f3c48708d437bbbab78ad4', 'Gold', 1799, NULL, 'unpaid', 'KOKO ARKI', '2007-04-11', 'townsite, Limay, Bataan', '0922-222-2222', 'akerezada@bpsu.edu.ph', 'UMID', '', 'erd lynx.jpg', 'erd lynx.jpg', 'Rented', '2025-04-22', '2025-04-28', 14.672054, 120.548230),
('0000000003', 'Wperez173', '699021f5752088d59ef9a77b289eb89d', 'Bronze', 0, '2025-04-28', 'paid', 'WESLEYJOSHUA PEREZ', '2025-04-25', 'bilolo, Orion, Bataan', '0938-086-8921', 'wesleyjoshuaperez@gmail.com', 'Drivers-License', '0312123456', 'wesley id.jpg', 'residency.png', 'Owned', '2025-04-24', '2025-04-19', 14.612406, 120.561927),
('0000000004', 'Kperez174', 'b296426fc6c6d22e33c83efdf68af670', 'Bronze', 1199, NULL, 'unpaid', 'KAREN PEREZ', '2007-04-17', 'sto.-domingo, Orion, Bataan', '0912-183-2731', 'wesleyjoshuaperez.iskolar@gmail.com', 'Passport', '', 'wesley id.jpg', 'jesstoni.jfif', 'Owned', '2025-05-19', '2025-04-28', 14.614517, 120.568165);

-- --------------------------------------------------------

--
-- Table structure for table `change_plan_application`
--

CREATE TABLE `change_plan_application` (
  `change_plan_id` int(11) NOT NULL,
  `user_id` varchar(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `current_plan` varchar(50) NOT NULL,
  `new_plan` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` text NOT NULL DEFAULT 'pending',
  `approved_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `change_plan_application`
--

INSERT INTO `change_plan_application` (`change_plan_id`, `user_id`, `full_name`, `current_plan`, `new_plan`, `price`, `changed_at`, `status`, `approved_date`) VALUES
(1, '0000000002', 'KOKO ARKI', 'Gold', 'Bronze', 1199.00, '2025-04-17 19:39:42', 'pending', NULL),
(2, '0000000003', 'WESLEYJOSHUA PEREZ', 'Silver', 'Bronze', 1199.00, '2025-04-24 19:40:33', 'Approved', '2025-04-24');

-- --------------------------------------------------------

--
-- Table structure for table `completion_report`
--

CREATE TABLE `completion_report` (
  `completion_id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `contact_number` varchar(50) NOT NULL,
  `issue_type` varchar(100) NOT NULL,
  `issue_description` text NOT NULL,
  `completion_datetime` datetime NOT NULL,
  `work_description` text NOT NULL,
  `parts_used` text DEFAULT NULL,
  `issues_encountered` text DEFAULT NULL,
  `technician_comments` text DEFAULT NULL,
  `submitted_by` varchar(255) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `completion_report`
--

INSERT INTO `completion_report` (`completion_id`, `client_name`, `contact_number`, `issue_type`, `issue_description`, `completion_datetime`, `work_description`, `parts_used`, `issues_encountered`, `technician_comments`, `submitted_by`, `submitted_at`) VALUES
(1, 'KOKO ARKI', '0922-222-2222', 'Frequent Disconnections', 'frequent disconnections', '2025-04-30 09:08:00', 'test one to test the status will be updated', 'test', 'test', 'test', 'John Doe', '2025-04-29 01:08:50'),
(2, 'WESLEYJOSHUA PEREZ', '0938-086-8921', 'Slow Internet Speed', 'slow internet connection', '2025-04-30 19:49:00', 'Done', 'Done', 'Done', 'Done', 'John Doe', '2025-04-30 11:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `lynx_admin`
--

CREATE TABLE `lynx_admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lynx_admin`
--

INSERT INTO `lynx_admin` (`admin_id`, `username`, `password`, `full_name`, `email_address`, `phone`, `created_at`) VALUES
(1, 'wesleyperez', '3cf8378495cb03a4f56565464edbed97', 'Wesley Joshua Perez', 'wjhperez@bpsu.edu.ph', '09300864398', '2025-03-10 03:54:22');

-- --------------------------------------------------------

--
-- Table structure for table `lynx_technicians`
--

CREATE TABLE `lynx_technicians` (
  `technician_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('Installer','Repair Technician') NOT NULL,
  `contact` varchar(20) NOT NULL,
  `status` enum('Available','Not-Available','On Leave') DEFAULT 'Available',
  `profile_image` varchar(255) DEFAULT 'default_profile.jpg',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lynx_technicians`
--

INSERT INTO `lynx_technicians` (`technician_id`, `name`, `username`, `password`, `role`, `contact`, `status`, `profile_image`, `created_at`) VALUES
(1, 'John Doe', 'johndoe', '4b2fe119d7a1f38c9827063a303bdda9', 'Installer', '09123456789', 'Available', 'john_doe.png', '2025-04-28 03:13:54'),
(2, 'Jane Smith', 'janesmith', 'a5deda94b53ebb6a9a53c23befcf386a', 'Repair Technician', '09234567890', 'Available', 'jane_smith.png', '2025-04-28 03:15:10'),
(3, 'Micheal Johnson', 'michealjohnson', '669df4813d1930186e49fbbc9c70a1a7', 'Installer', '09345678901', 'Available', 'michael_johnson.png', '2025-04-28 03:16:02'),
(4, 'Emily Davis', 'emilydavis', '7670857f57c178d9df2c23cd7639392f', 'Repair Technician', '09456789012', 'Available', 'emily_davis.png', '2025-04-28 03:16:47'),
(5, 'Robert Brown', 'robertbrown', '080c8fc68c7f949d491bd3b96b4ed2c7', 'Installer', '09567890123', 'Available', 'robert_brown.png', '2025-04-28 03:17:31'),
(6, 'Jess Zapata', 'Jesstoni101', '56fc4c0bdb10be3fe8ca2aa826cbae41', 'Installer', '09128689551', 'Available', 'jesstoni.jfif', '2025-04-28 03:18:11');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `maintenance_id` int(11) NOT NULL,
  `user_id` varchar(11) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `issue_type` varchar(50) NOT NULL,
  `issue_description` text NOT NULL,
  `contact_time` varchar(50) NOT NULL,
  `evidence_filename` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `technician_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_requests`
--

INSERT INTO `maintenance_requests` (`maintenance_id`, `user_id`, `full_name`, `contact_number`, `address`, `issue_type`, `issue_description`, `contact_time`, `evidence_filename`, `submitted_at`, `status`, `technician_name`) VALUES
(1, '0000000002', 'KOKO ARKI', '0922-222-2222', 'townsite, Limay, Bataan', 'Frequent Disconnections', 'frequent disconnections', 'Afternoon (12PM - 4PM)', 'erd lynx.jpg', '2025-04-17 11:22:28', 'Completed', 'John Doe'),
(2, '0000000001', 'ANGELINE KATE REZADA', '0905-462-7399', 'sto.-domingo, Orion, Bataan', 'Frequent Disconnections', 'sample', 'Morning (8AM - 12PM)', '', '2025-04-17 12:46:13', 'Ongoing', NULL),
(3, '0000000003', 'WESLEYJOSHUA PEREZ', '0938-086-8921', 'bilolo, Orion, Bataan', 'Slow Internet Speed', 'slow internet connection', 'Afternoon (12PM - 4PM)', 'image test.jfif', '2025-04-24 11:17:57', 'Completed', 'John Doe');

-- --------------------------------------------------------

--
-- Table structure for table `nap_box_availability`
--

CREATE TABLE `nap_box_availability` (
  `nap_box_id` varchar(11) NOT NULL,
  `nap_box_brgy` varchar(100) NOT NULL,
  `available_slots` int(11) NOT NULL,
  `nap_box_longitude` decimal(10,6) NOT NULL,
  `nap_box_latitude` decimal(10,6) NOT NULL,
  `nap_box_status` enum('Enabled','Disabled') NOT NULL DEFAULT 'Enabled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nap_box_availability`
--

INSERT INTO `nap_box_availability` (`nap_box_id`, `nap_box_brgy`, `available_slots`, `nap_box_longitude`, `nap_box_latitude`, `nap_box_status`) VALUES
('0000000001', 'BILOLO-POST1', 15, 120.558045, 14.619323, 'Disabled'),
('0000000002', 'BILOLO-POST2', 14, 120.562506, 14.616986, 'Enabled');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` varchar(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `subscription_plan` varchar(50) NOT NULL,
  `mode_of_payment` varchar(50) NOT NULL,
  `added_misc` decimal(10,2) DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `reference_number` varchar(50) NOT NULL,
  `proof_of_payment` text NOT NULL,
  `status` varchar(20) DEFAULT 'Pending',
  `admin_remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `user_id`, `fullname`, `subscription_plan`, `mode_of_payment`, `added_misc`, `paid_amount`, `payment_date`, `reference_number`, `proof_of_payment`, `status`, `admin_remarks`) VALUES
(1, '0000000001', 'ANGELINE KATE REZADA', 'Bronze', 'GCash', 0.00, 1199.00, '2025-05-04 10:30:24', '3434 343 434343', '681725a05970f491219887_1203006901527316_4438388944262983365_n.jpg', 'Paid', NULL),
(2, '0000000002', 'KOKO ARKI', 'Gold', 'GCash', 0.00, 1799.00, '2025-05-04 10:34:29', '8293 081 389623', '6817269583ca8gcash.png', 'Pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `progress_reports`
--

CREATE TABLE `progress_reports` (
  `progress_id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `contact_number` varchar(50) NOT NULL,
  `issue_type` varchar(100) NOT NULL,
  `issue_description` text NOT NULL,
  `progress_update` text NOT NULL,
  `work_done` text NOT NULL,
  `time_spent_in_hour` decimal(5,2) NOT NULL,
  `submitted_by` varchar(255) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `progress_reports`
--

INSERT INTO `progress_reports` (`progress_id`, `client_name`, `contact_number`, `issue_type`, `issue_description`, `progress_update`, `work_done`, `time_spent_in_hour`, `submitted_by`, `submitted_at`) VALUES
(1, 'KOKO ARKI', '0922-222-2222', 'Frequent Disconnections', 'frequent disconnections', 'progress update', 'progress update', 2.00, 'John Doe', '2025-04-17 12:42:44'),
(2, 'KOKO ARKI', '0922-222-2222', 'Frequent Disconnections', 'frequent disconnections', 'progress update 2', 'progress update 2', 2.00, 'John Doe', '2025-04-17 12:44:52'),
(3, 'WESLEYJOSHUA PEREZ', '0938-086-8921', 'Slow Internet Speed', 'slow internet connection', 'Test progress', 'Test progress', 1.50, 'John Doe', '2025-04-30 11:31:09');

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
  `address_latitude` decimal(10,6) DEFAULT NULL,
  `address_longitude` decimal(10,6) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registration_acc`
--

INSERT INTO `registration_acc` (`id`, `subscription_plan`, `first_name`, `last_name`, `contact_number`, `email_address`, `birth_date`, `id_type`, `id_number`, `id_photo`, `home_ownership_type`, `province`, `municipality`, `barangay`, `proof_of_residency`, `installation_date`, `registration_date`, `terms_agreed`, `data_processing_consent`, `id_photo_consent`, `address_latitude`, `address_longitude`, `status`) VALUES
(1, 'Bronze', 'ANGELINE KATE', 'REZADA', '0905-462-7399', 'katerezada0120@gmail.com', '2003-11-20', 'UMID', '', 'erd lynx.jpg', 'Owned', 'Bataan', 'Orion', 'sto.-domingo', 'erd lynx.jpg', '2025-07-09', '2025-04-17 08:20:50', 'Checked', 'Checked', 'Checked', 14.676538, 120.546253, 'Approved'),
(2, 'Gold', 'KOKO', 'ARKI', '0922-222-2222', 'akerezada@bpsu.edu.ph', '2007-04-11', 'UMID', '', 'erd lynx.jpg', 'Rented', 'Bataan', 'Limay', 'townsite', 'erd lynx.jpg', '2025-04-22', '2025-04-17 09:08:52', 'Checked', 'Checked', 'Checked', 14.672054, 120.548230, 'Approved'),
(3, 'Silver', 'WESLEYJOSHUA', 'PEREZ', '0938-086-8921', 'wesleyjoshuaperez@gmail.com', '2004-03-17', 'Drivers-License', '0312123456', 'wesley id.jpg', 'Owned', 'Bataan', 'Orion', 'bilolo', 'residency.png', '2025-04-25', '2025-04-19 05:34:49', 'Checked', 'Checked', 'Checked', 14.612406, 120.561927, 'Approved'),
(4, 'Bronze', 'KAREN', 'PEREZ', '0912-183-2731', 'wesleyjoshuaperez.iskolar@gmail.com', '2007-04-17', 'Passport', '', 'wesley id.jpg', 'Owned', 'Bataan', 'Orion', 'sto.-domingo', 'jesstoni.jfif', '2025-05-19', '2025-04-28 00:40:49', 'Checked', 'Checked', 'Checked', 14.614517, 120.568165, 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `resetpass_request`
--

CREATE TABLE `resetpass_request` (
  `resetpass_request_id` int(11) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` varchar(11) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resetpass_request`
--

INSERT INTO `resetpass_request` (`resetpass_request_id`, `reset_token`, `email_address`, `request_date`, `user_id`, `role`) VALUES
(6, 'RCHKWAM4Q7', 'wesleyjoshuaperez@gmail.com', '2025-04-27 18:52:44', '0000000003', 'user'),
(7, 'QYVMB53TCP', 'wesleyjoshuaperez@gmail.com', '2025-04-27 18:54:46', '0000000003', 'user'),
(8, '54OEZQ9SIH', 'wesleyjoshuaperez@gmail.com', '2025-04-27 18:55:05', '0000000003', 'user'),
(9, 'AXI81OM40N', 'wesleyjoshuaperez@gmail.com', '2025-04-27 18:55:17', '0000000003', 'user'),
(10, 'B9U3I2ODTL', 'wesleyjoshuaperez@gmail.com', '2025-04-27 18:57:44', '0000000003', 'user'),
(11, 'H780KZW3CO', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:07:00', '0000000003', 'user'),
(12, 'G09QXE3NRU', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:07:30', '0000000003', 'user'),
(13, 'QRJ5T1IYNV', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:07:50', '0000000003', 'user'),
(14, '37HNV1SIJP', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:10:07', '0000000003', 'user'),
(15, '7CN1XFBPVG', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:13:25', '0000000003', 'user'),
(16, 'BA32E1LVSZ', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:17:10', '0000000003', 'user'),
(17, '17D46S9TJZ', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:22:35', '0000000003', 'user'),
(18, 'ECR7P02DSO', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:24:02', '0000000003', 'user'),
(19, 'AVRGMS8XH9', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:24:11', '0000000003', 'user'),
(20, '0SJIW9Q74A', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:30:06', '0000000003', 'user'),
(21, 'HTW1BIXKOS', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:31:11', '0000000003', 'user'),
(22, 'OVP7KL2G8I', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:47:45', '0000000003', 'user'),
(23, 'J97LT86XQV', 'wesleyjoshuaperez@gmail.com', '2025-04-27 19:53:32', '0000000003', 'user'),
(24, '2P0Y3NFH1I', 'wesleyjoshuaperez@gmail.com', '2025-04-27 20:00:08', '0000000003', 'user'),
(25, 'T1F7MYRIHU', 'wesleyjoshuaperez@gmail.com', '2025-04-27 20:07:28', '0000000003', 'user'),
(26, '7CTDEWA13O', 'wesleyjoshuaperez@gmail.com', '2025-04-27 20:09:47', '0000000003', 'user'),
(27, 'E8DI9ZA3LC', 'wesleyjoshuaperez@gmail.com', '2025-04-27 20:14:23', '0000000003', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approved_user`
--
ALTER TABLE `approved_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `change_plan_application`
--
ALTER TABLE `change_plan_application`
  ADD PRIMARY KEY (`change_plan_id`);

--
-- Indexes for table `completion_report`
--
ALTER TABLE `completion_report`
  ADD PRIMARY KEY (`completion_id`);

--
-- Indexes for table `lynx_admin`
--
ALTER TABLE `lynx_admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email_address`);

--
-- Indexes for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  ADD PRIMARY KEY (`technician_id`);

--
-- Indexes for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD PRIMARY KEY (`maintenance_id`);

--
-- Indexes for table `nap_box_availability`
--
ALTER TABLE `nap_box_availability`
  ADD PRIMARY KEY (`nap_box_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `progress_reports`
--
ALTER TABLE `progress_reports`
  ADD PRIMARY KEY (`progress_id`);

--
-- Indexes for table `registration_acc`
--
ALTER TABLE `registration_acc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  ADD PRIMARY KEY (`resetpass_request_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `change_plan_application`
--
ALTER TABLE `change_plan_application`
  MODIFY `change_plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `completion_report`
--
ALTER TABLE `completion_report`
  MODIFY `completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lynx_admin`
--
ALTER TABLE `lynx_admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `progress_reports`
--
ALTER TABLE `progress_reports`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `resetpass_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

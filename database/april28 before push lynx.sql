-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2025 at 01:25 PM
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
('0000000001', 'AKrezada20', 'kyotcapybara20', 'Bronze', 1199, NULL, 'unpaid', 'ANGELINE KATE REZADA', '2003-11-20', 'sto.-domingo, Orion, Bataan', '0905-462-7399', 'katerezada0120@gmail.com', 'UMID', '', 'erd lynx.jpg', 'erd lynx.jpg', 'Owned', '2025-07-09', '2025-04-17', 14.676538, 120.546253),
('0000000002', 'Karki11', 'kokoarki11', 'Gold', 1799, NULL, 'unpaid', 'KOKO ARKI', '2007-04-11', 'townsite, Limay, Bataan', '0922-222-2222', 'akerezada@bpsu.edu.ph', 'UMID', '', 'erd lynx.jpg', 'erd lynx.jpg', 'Rented', '2025-04-22', '2025-04-17', 14.672054, 120.548230),
('0000000003', 'Wperez173', 'wesleyjoshua1', 'Bronze', 1199, NULL, 'unpaid', 'WESLEYJOSHUA PEREZ', '2025-04-25', 'bilolo, Orion, Bataan', '0938-086-8921', 'wesleyjoshuaperez@gmail.com', 'Drivers-License', '0312123456', 'wesley id.jpg', 'residency.png', 'Owned', '2025-04-24', '2025-04-19', 14.612406, 120.561927);

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
(1, 'KOKO ARKI', '0922-222-2222', 'Frequent Disconnections', 'frequent disconnections', '2025-05-02 20:43:00', 'completed', 'completed', 'completed', 'completed', 'John Doe', '2025-04-17 12:43:14');

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
(1, 'wesleyperez', '2004adminlynx', 'Wesley Joshua Perez', 'wjhperez@bpsu.edu.ph', '09300864398', '2025-03-10 03:54:22');

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
(1, 'John Doe', 'johndoe', 'johndoe12', 'Installer', '09123456789', 'Available', 'john_doe.png', '2025-03-19 06:47:27'),
(2, 'Jane Smith', 'janesmith', 'janesmith44', 'Repair Technician', '09234567890', 'Available', 'jane_smith.png', '2025-03-19 06:47:27'),
(3, 'Michael Johnson', 'michaeljohnson', 'michaeljohnson123', 'Installer', '09345678901', 'Available', 'michael_johnson.png', '2025-03-19 06:47:27'),
(4, 'Emily Davis', 'emilydavis', 'emilydavis123', 'Repair Technician', '09456789012', 'Available', 'emily_davis.png', '2025-03-19 06:47:27'),
(5, 'Robert Brown', 'robertbrown', 'robertbrown123', 'Installer', '09567890123', 'Available', 'robert_brown.png', '2025-03-19 06:47:27'),
(6, 'Jess Zapata', 'Jesstoni101', 'Jestoni101', 'Installer', '09128689551', 'Available', 'jesstoni.jfif', '2025-04-27 09:15:03');

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
(1, '0000000002', 'KOKO ARKI', '0922-222-2222', 'townsite, Limay, Bataan', 'Frequent Disconnections', 'frequent disconnections', 'Afternoon (12PM - 4PM)', 'erd lynx.jpg', '2025-04-17 11:22:28', 'Assigned', 'John Doe'),
(2, '0000000001', 'ANGELINE KATE REZADA', '0905-462-7399', 'sto.-domingo, Orion, Bataan', 'Frequent Disconnections', 'sample', 'Morning (8AM - 12PM)', '', '2025-04-17 12:46:13', 'Ongoing', NULL),
(3, '0000000003', 'WESLEYJOSHUA PEREZ', '0938-086-8921', 'bilolo, Orion, Bataan', 'Slow Internet Speed', 'slow internet connection', 'Afternoon (12PM - 4PM)', 'image test.jfif', '2025-04-24 11:17:57', 'Ongoing', NULL);

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
(2, 'KOKO ARKI', '0922-222-2222', 'Frequent Disconnections', 'frequent disconnections', 'progress update 2', 'progress update 2', 2.00, 'John Doe', '2025-04-17 12:44:52');

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
(3, 'Silver', 'WESLEYJOSHUA', 'PEREZ', '0938-086-8921', 'wesleyjoshuaperez@gmail.com', '2004-03-17', 'Drivers-License', '0312123456', 'wesley id.jpg', 'Owned', 'Bataan', 'Orion', 'bilolo', 'residency.png', '2025-04-25', '2025-04-19 05:34:49', 'Checked', 'Checked', 'Checked', 14.612406, 120.561927, 'Approved');

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
  MODIFY `completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `progress_reports`
--
ALTER TABLE `progress_reports`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `resetpass_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

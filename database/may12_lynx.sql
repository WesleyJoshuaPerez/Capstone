-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 07:42 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
('0000000002', 'AKrezada202', 'b2c5193ae7cafb6cb6261eeb33f61a1f', 'Gold', 1799, NULL, 'unpaid', 'ANGELINE KATE REZADA', '2003-11-20', 'wawa, Orion, Bataan', '0905-462-7399', 'katerezada0120@gmail.com', 'Postal-ID', '', 'id_picture.png', 'id_picture.png', 'Rented', '2025-05-27', '2025-05-12', 14.623204, 120.583979);

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
(1, 'John Doe', 'johndoe', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Installer', '0912-345-6789', 'Available', 'id_picture.png', '2025-05-12 02:42:21'),
(2, 'Jane Smith', 'janesmith', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Repair Technician', '0923-456-7890', 'Available', 'id_picture.png', '2025-05-12 02:43:05'),
(3, 'Michael Johnson', 'michaeljohnson', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Installer', '0934-567-8901', 'Available', 'id_picture.png', '2025-05-12 02:43:39'),
(4, 'Emily Davis', 'emilydavis', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Repair Technician', '0945-678-9012', 'Available', 'id_picture.png', '2025-05-12 02:44:06'),
(5, 'Robert Brown', 'robertbrown', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Installer', '0956-789-0123', 'Available', 'id_picture.png', '2025-05-12 02:44:40'),
(6, 'Jess Zapata', 'Jesstoni101', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Installer', '0912-868-9551', 'Available', 'id_picture.png', '2025-05-12 02:45:33');

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
('0000000001', 'WAWA-POST1', 10, 120.583247, 14.623189, 'Enabled'),
('0000000002', 'WAKAS-POST2', 10, 120.579301, 14.616296, 'Enabled'),
('0000000003', 'DAANG BILOLO-POST5', 10, 120.574412, 14.618289, 'Enabled'),
('0000000004', 'KAPUNITAN-POST8', 15, 120.584104, 14.616296, 'Enabled');

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
(1, 'Silver', 'ANGELINE KATE', 'REZAZDA', '0905-462-7399', 'katerezada0120@gmail.com', '2003-11-20', 'Philhealth-ID', '', 'id_picture.png', 'Rented', 'Bataan', 'Orion', 'general-lim', 'id_picture.png', '2025-05-27', '2025-05-12 05:22:10', 'Checked', 'Checked', 'Checked', 14.846431, 120.356588, 'Denied'),
(2, 'Gold', 'ANGELINE KATE', 'REZADA', '0905-462-7399', 'katerezada0120@gmail.com', '2003-11-20', 'Postal-ID', '', 'id_picture.png', 'Rented', 'Bataan', 'Orion', 'wawa', 'id_picture.png', '2025-05-27', '2025-05-12 05:38:32', 'Checked', 'Checked', 'Checked', 14.623204, 120.583979, 'Approved');

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
  MODIFY `change_plan_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `completion_report`
--
ALTER TABLE `completion_report`
  MODIFY `completion_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lynx_admin`
--
ALTER TABLE `lynx_admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `progress_reports`
--
ALTER TABLE `progress_reports`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `resetpass_request_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

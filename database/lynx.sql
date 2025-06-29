-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2025 at 09:39 AM
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
('0000000003', 'WJperez173', '60e8871e38e814cf32a6445dd38743e6', 'Gold', 1799, '2025-05-14', 'unpaid', 'WESLEY JOSHUA PEREZ', '2004-03-17', 'bilolo, Orion, Bataan', '0912-868-9551', 'wesleyjoshuaperez.iskolar@gmail.com', 'Drivers-License', '', 'id.png', 'A2.jpg', 'Owned', '2025-05-17', '2025-05-12', 14.612382, 120.561901, NULL),
('0000000004', 'Aheramis074', 'ec53253155cfb518af076a612bf16301', 'Silver', 1499, NULL, 'unpaid', 'APRIL HERAMIS', '2007-05-07', 'sabatan, Orion, Bataan', '0934-897-3489', 'perezwesley17@gmail.com', 'Drivers-License', '', 'testid.jpg', 'gcash.png', 'Rented', '2025-05-26', '2025-05-14', 14.615030, 120.568467, NULL),
('0000000005', 'Tmendoza045', '84a2c5dd30a4d777aeb1cd251c61e9d7', 'Silver', 1499, NULL, 'unpaid', 'TROY MENDOZA', '2007-06-04', 'sabatan, Orion, Bataan', '0923-929-3872', 'sojori6529@finfave.com', 'Drivers-License', '0312123456', 'gundam.png', 'wallpaper.jpg', 'Rented', '2025-07-11', '2025-06-23', 14.614992, 120.567946, '0000000005');

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
(1, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Bronze', 1199.00, '2025-05-13 17:54:29', 'Denied', NULL),
(2, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Bronze', 1199.00, '2025-05-13 20:48:47', 'Denied', NULL);

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
(1, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'Router/Modem Issues', 'sdsds', '2025-05-13 06:47:00', 'done', 'done', 'done', '', 'John Doe', '2025-05-12 22:47:58'),
(2, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'No Internet Connection', 'mahina net nag lalag', '2025-05-13 17:57:00', 'complete', 'complete', 'complete', 'complete', 'Jess Zapata', '2025-05-13 09:57:54'),
(3, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'Slow Internet Speed', 'mahina net', '2025-05-13 17:59:00', 'complete 2', 'complete 2', 'complete 2', 'complete 2', 'Jess Zapata', '2025-05-13 09:59:41'),
(4, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'No Internet Connection', 'testing', '2025-05-13 22:02:00', 'Completion 2', 'Completion 2', 'Completion 2', 'Completion 2', 'John Doe', '2025-05-13 14:02:36');

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
(1, 'administrator', '9a662d68b1e64ab582c48c6e833a5497', 'Wesley Joshua Perez', 'wjhperez@bpsu.edu.ph', '09300864398', '2025-03-10 03:54:22');

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
(1, 'John Doe', 'johndoe', 'a000786c761a773029f71e5d52cc3c7d', 'Installer', '0912-345-6789', 'Available', 'id_picture.png', '2025-05-12 02:42:21'),
(2, 'Jane Smith', 'janesmith', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Repair Technician', '0923-456-7890', 'Available', 'id_picture.png', '2025-05-12 02:43:05'),
(9, 'Rodrigo Rodriguez', 'Rodrigo', 'd71b04dcad53561ded979a5144149ba1', 'Repair Technician', '0923-233-2223', 'Available', 'testid.jpg', '2025-05-12 08:58:33'),
(10, 'Wilfredo Perez jr', 'wilfredo', '3be294a78379ad73f02ef62097eb456a', 'Repair Technician', '0992-738-7289', 'Available', 'testid.jpg', '2025-05-12 09:01:07'),
(11, 'Jess Zapata', 'Jesstoni101', '56fc4c0bdb10be3fe8ca2aa826cbae41', 'Installer', '0982-394-7433', 'Available', 'testid.jpg', '2025-05-12 23:08:54'),
(13, 'Sebastian Paclaon', 'Sebastian', '9971e401028d33fd5647486cb98b126a', 'Repair Technician', '0947-637-8468', 'Available', 'testid.jpg', '2025-05-13 12:59:12');

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
(1, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Router/Modem Issues', 'sdsds', 'Morning (8AM - 12PM)', 'image test.jfif', '2025-05-12 14:44:24', 'Completed', 'John Doe'),
(2, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'No Internet Connection', 'mahina net nag lalag', 'Morning (8AM - 12PM)', 'napbox_enabled.png', '2025-05-12 23:17:29', 'Completed', 'Jess Zapata'),
(3, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Slow Internet Speed', 'mahina net', 'Morning (8AM - 12PM)', 'image test.jfif', '2025-05-12 23:24:08', 'Completed', 'Jess Zapata'),
(4, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Router/Modem Issues', 'test', 'Afternoon (12PM - 4PM)', 'testid.jpg', '2025-05-13 09:49:14', 'Denied', NULL),
(5, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'No Internet Connection', 'testing', 'Morning (8AM - 12PM)', 'testid.jpg', '2025-05-13 12:53:06', 'Completed', 'John Doe');

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
('0000000001', 'WAWA-POST1', 10, 120.583247, 14.623189, 'Disabled'),
('0000000002', 'WAKAS-POST2', 10, 120.579301, 14.616296, 'Disabled'),
('0000000003', 'DAANG BILOLO-POST5', 10, 120.574412, 14.618289, 'Enabled'),
('0000000004', 'KAPUNITAN-POST8', 15, 120.584104, 14.616296, 'Enabled'),
('0000000005', 'BILOLO-POST1', 13, 120.562369, 14.612781, 'Enabled'),
('0000000006', 'SANTO DOMINGO-POST3', 12, 120.572269, 14.633450, 'Enabled');

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
(1, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'PayPal', 0.00, 1799.00, '2025-05-12 00:00:00', '37J73129CJ440650A', '{\"id\":\"37J73129CJ440650A\",\"status\":\"COMPLETED\",\"amount\":\"1799.00\"}', 'Paid', NULL),
(2, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 160.00, '2025-05-13 01:47:50', '8293 081 389623', '682288a6541c6491219887_1203006901527316_4438388944262983365_n.jpg', 'Denied', 'the image is blurry please try again to reuploaded it'),
(3, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 160.00, '2025-05-13 01:49:48', '9785 478 897592', '6822891cc35ebgcash_qrcode.jpg', 'Paid', NULL),
(4, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Onsite', 0.00, 50.00, '2025-05-13 00:00:00', 'N/A', 'Onsite Payment', 'Paid', NULL),
(5, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'PayPal', 0.00, 1000.00, '2025-05-13 00:00:00', '6WT70228SL302281L', '{\"id\":\"6WT70228SL302281L\",\"status\":\"COMPLETED\",\"amount\":\"1000.00\"}', 'Paid', NULL),
(6, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1000.00, '2025-05-13 16:10:29', '3894 834 333344', '682352d5613dd491219887_1203006901527316_4438388944262983365_n.jpg', 'Paid', NULL),
(7, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1000.00, '2025-05-14 00:24:12', '7897 978 989898', '6823c68cabaeftestid.jpg', 'Denied', 'testing kung gagana ung gcash na isa'),
(8, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1000.00, '2025-05-14 00:32:05', '3745 893 485798', '6823c86503245testid.jpg', 'Paid', NULL);

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
(1, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'Router/Modem Issues', 'sdsds', 'progress', 'progress', 2.00, 'John Doe', '2025-05-12 22:46:58'),
(2, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'No Internet Connection', 'testing', 'Progress 1', 'Progress 1', 2.00, 'John Doe', '2025-05-13 14:01:44'),
(3, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'No Internet Connection', 'testing', 'Progress 2', 'Progress 2', 2.00, 'John Doe', '2025-05-13 14:02:00');

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
(2, 'Gold', 'ANGELINE KATE', 'REZADA', '0905-462-7399', 'katerezada0120@gmail.com', '2003-11-20', 'Postal-ID', '', 'id_picture.png', 'Rented', 'Bataan', 'Orion', 'wawa', 'id_picture.png', '2025-05-27', '2025-05-12 05:38:32', 'Checked', 'Checked', 'Checked', 14.623204, 120.583979, 'Approved'),
(3, 'Gold', 'WESLEY JOSHUA', 'PEREZ', '0912-868-9551', 'wesleyjoshuaperez.iskolar@gmail.com', '2004-03-17', 'Drivers-License', '', 'id.png', 'Owned', 'Bataan', 'Orion', 'bilolo', 'A2.jpg', '2025-05-17', '2025-05-12 09:45:46', 'Checked', 'Checked', 'Checked', 14.612382, 120.561901, 'Approved'),
(4, 'Silver', 'APRIL', 'HERAMIS', '0934-897-3489', 'perezwesley17@gmail.com', '2007-05-07', 'Drivers-License', '', 'testid.jpg', 'Rented', 'Bataan', 'Orion', 'sabatan', 'gcash.png', '2025-05-26', '2025-05-13 14:07:36', 'Checked', 'Checked', 'Checked', 14.615030, 120.568467, 'Approved'),
(5, 'Silver', 'TROY', 'MENDOZA', '0923-929-3872', 'sojori6529@finfave.com', '2007-06-04', 'Drivers-License', '0312123456', 'gundam.png', 'Rented', 'Bataan', 'Orion', 'sabatan', 'wallpaper.jpg', '2025-07-11', '2025-06-23 07:53:50', 'Checked', 'Checked', 'Checked', 14.614992, 120.567946, 'Approved'),
(6, 'Silver', 'JAYSON', 'NAVARRO', '0934-837-6849', 'lofacej256@decodewp.com', '2007-06-25', 'Drivers-License', '', 'wallpaper.jpg', 'Rented', 'Bataan', 'Orion', 'daang-bilolo', 'wallpaper.jpg', '2025-07-28', '2025-06-28 11:20:20', 'Checked', 'Checked', 'Checked', 14.619254, 120.574305, 'Pending');

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
  MODIFY `change_plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `completion_report`
--
ALTER TABLE `completion_report`
  MODIFY `completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lynx_admin`
--
ALTER TABLE `lynx_admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `progress_reports`
--
ALTER TABLE `progress_reports`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `resetpass_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

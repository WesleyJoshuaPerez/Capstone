-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 19, 2025 at 08:40 AM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u242690062_lynx`
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
  `nap_box_id` varchar(11) DEFAULT NULL,
  `account_status` varchar(20) NOT NULL DEFAULT 'active',
  `reminder_sent` tinyint(1) DEFAULT 0,
  `due_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approved_user`
--

INSERT INTO `approved_user` (`user_id`, `username`, `password`, `subscription_plan`, `currentBill`, `last_payment_date`, `payment_status`, `fullname`, `birth_date`, `address`, `contact_number`, `email_address`, `id_type`, `id_number`, `id_photo`, `proof_of_residency`, `home_ownership_type`, `installation_date`, `registration_date`, `address_latitude`, `address_longitude`, `nap_box_id`, `account_status`, `reminder_sent`, `due_date`) VALUES
('0000000002', 'AKrezada202', '482c811da5d5b4bc6d497ffa98491e38', 'Gold', 1799, NULL, 'unpaid', 'ANGELINE KATE REZADA', '2003-11-20', 'wawa, Orion, Bataan', '0905-462-7399', 'katerezada0120@gmail.com', 'Postal-ID', '', 'id_picture.png', 'id_picture.png', 'Rented', '2025-05-27', '2025-05-12', 14.623204, 120.583979, '0000000005', 'active', 1, '2025-07-27'),
('0000000003', 'WJperez173', '60e8871e38e814cf32a6445dd38743e6', 'Gold', 1799, '2025-07-07', 'unpaid', 'WESLEY JOSHUA PEREZ', '2004-03-17', 'bilolo, Orion, Bataan', '0912-868-9551', 'wesleyjoshuaperez.iskolar@gmail.com', 'Drivers-License', '', 'id.png', 'A2.jpg', 'Owned', '2025-05-17', '2025-05-12', 14.612382, 120.561901, '0000000001', 'active', 1, '2025-07-17'),
('0000000004', 'Aheramis074', '3df82057f5434cf22c7a2cf31a345703', 'Silver', 0, '2025-08-13', 'paid', 'APRIL HERAMIS', '2007-05-07', 'sabatan, Orion, Bataan', '0934-897-3489', 'perezwesley17@gmail.com', 'Drivers-License', '', 'testid.jpg', 'gcash.png', 'Rented', '2025-05-26', '2025-05-14', 14.615030, 120.568467, '0000000004', 'active', 0, '2025-08-26'),
('0000000005', 'Tmendoza045', '84a2c5dd30a4d777aeb1cd251c61e9d7', 'Silver', 0, '2025-08-18', 'paid', 'TROY MENDOZA', '2007-06-04', 'sabatan, Orion, Bataan', '0923-929-3872', 'sojori6529@finfave.com', 'Drivers-License', '0312123456', 'gundam.png', 'wallpaper.jpg', 'Rented', '2025-07-11', '2025-06-23', 14.614992, 120.567946, '0000000004', 'active', 0, '2025-09-11'),
('0000000013', 'Jbarion0113', '5d40a97b22c4c4b6e3c39be3670ab1ba', 'Bronze', 1199, '2025-08-19', 'paid', 'JONATHAN BARION', '2007-08-01', 'bilolo, Orion, Bataan', '0989-389-2323', 'wesleyjoshuaperez@gmail.com', 'Passport', '', 'id id.png', '515440261_1160256179477713_3040547872935918090_n.jpg', 'Rented', '2025-08-19', '2025-08-19', 14.612423, 120.562380, '0000000001', 'active', 0, '2025-11-12');

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
(1, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Bronze', 1199.00, '2025-05-13 17:54:29', 'Viewed', NULL),
(2, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Bronze', 1199.00, '2025-05-13 20:48:47', 'Viewed', NULL),
(3, '0000000004', 'APRIL HERAMIS', 'Silver', 'Gold', 1799.00, '2025-07-28 11:12:00', 'Denied', NULL),
(4, '0000000013', 'JONATHAN BARION', 'Silver', 'Bronze', 1199.00, '2025-08-19 02:55:03', 'Approved', '2025-08-19');

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
(4, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'No Internet Connection', 'testing', '2025-05-13 22:02:00', 'Completion 2', 'Completion 2', 'Completion 2', 'Completion 2', 'John Doe', '2025-05-13 14:02:36'),
(5, 'ANGELINE KATE REZADA', '0905-462-7399', 'Slow Internet Speed', 'slow internet', '2025-07-18 18:37:00', 'done', 'done', 'done', 'done', 'John Doe', '2025-07-18 10:37:20'),
(6, 'ANGELINE KATE REZADA', '0905-462-7399', 'No Internet Connection', 'no internet connection', '2025-07-18 21:38:00', 'testing', 'testing', 'testing', 'testing', 'John Doe', '2025-07-18 13:38:50'),
(7, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'Frequent Disconnections', 'Testing on live domain', '2025-08-18 11:21:00', 'It\'s being done.', '1 Cable Ethernet', 'None.', 'so far so good.', 'John Doe', '2025-08-18 03:28:06');

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
(1, 'John Doe', 'johndoe', 'e8ee9737b4dcc561bd0c95a17e719b6b', 'Installer', '0912-345-6789', 'Available', 'id_picture.png', '2025-05-12 02:42:21'),
(2, 'Jane Smith', 'janesmith', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Repair Technician', '0923-456-7890', 'Available', 'id_picture.png', '2025-05-12 02:43:05'),
(9, 'Rodrigo Rodriguez', 'Rodrigo', 'd71b04dcad53561ded979a5144149ba1', 'Repair Technician', '0923-233-2223', 'Available', 'testid.jpg', '2025-05-12 08:58:33'),
(10, 'Wilfredo Perez jr', 'wilfredo', '3be294a78379ad73f02ef62097eb456a', 'Repair Technician', '0992-738-7289', 'Available', 'testid.jpg', '2025-05-12 09:01:07'),
(11, 'Jess Zapata', 'Jesstoni101', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Installer', '0982-394-7433', 'Available', 'testid.jpg', '2025-05-12 23:08:54'),
(13, 'Sebastian Paclaon', 'Sebastian', '12d9b0f91ca90be6b4c3dc0081da0b2b', 'Repair Technician', '0947-637-8468', 'Available', 'testid.jpg', '2025-05-13 12:59:12');

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
(1, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Router/Modem Issues', 'sdsds', 'Morning (8AM - 12PM)', 'image test.jfif', '2025-05-12 14:44:24', 'Viewed', 'John Doe'),
(2, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'No Internet Connection', 'mahina net nag lalag', 'Morning (8AM - 12PM)', 'napbox_enabled.png', '2025-05-12 23:17:29', 'Viewed', 'Jess Zapata'),
(3, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Slow Internet Speed', 'mahina net', 'Morning (8AM - 12PM)', 'image test.jfif', '2025-05-12 23:24:08', 'Viewed', 'Jess Zapata'),
(4, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Router/Modem Issues', 'test', 'Afternoon (12PM - 4PM)', 'testid.jpg', '2025-05-13 09:49:14', 'Viewed', NULL),
(5, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'No Internet Connection', 'testing', 'Morning (8AM - 12PM)', 'testid.jpg', '2025-05-13 12:53:06', 'Viewed', 'John Doe'),
(6, '0000000003', 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'bilolo, Orion, Bataan', 'Frequent Disconnections', 'Testing on live domain', 'Morning (8AM - 12PM)', '1721110120440.jpg', '2025-07-11 01:05:57', 'Viewed', 'John Doe'),
(7, '0000000002', 'ANGELINE KATE REZADA', '0905-462-7399', 'wawa, Orion, Bataan', 'Slow Internet Speed', 'slow internet', 'Morning (8AM - 12PM)', 'NW3D_20250717_162134_0000.png', '2025-07-18 10:32:18', 'Viewed', 'John Doe'),
(8, '0000000002', 'ANGELINE KATE REZADA', '0905-462-7399', 'wawa, Orion, Bataan', 'No Internet Connection', 'no internet connection', 'Morning (8AM - 12PM)', '', '2025-07-18 12:10:55', 'Viewed', 'John Doe'),
(9, '0000000004', 'APRIL HERAMIS', '0934-897-3489', 'sabatan, Orion, Bataan', 'Slow Internet Speed', 'router internet is slow', 'Afternoon (12PM - 4PM)', 'assess02.jpg', '2025-08-11 03:30:26', 'Assigned', 'John Doe'),
(10, '0000000008', 'FRANKLYN SMITH', '0948-579-4867', 'bagumbayan, Orion, Bataan', 'Slow Internet Speed', 'mabagal net pota', 'Evening (4PM - 8PM)', 'twpitw.jpg', '2025-08-17 10:48:48', 'Assigned', 'Jess Zapata'),
(11, '0000000008', 'FRANKLYN SMITH', '0948-579-4867', 'bagumbayan, Orion, Bataan', 'No Internet Connection', 'BWHKFBURBGTH4', 'Afternoon (12PM - 4PM)', 'Screenshot 2025-08-17 182745.png', '2025-08-18 01:54:25', 'Ongoing', NULL),
(12, '0000000011', 'VIOLA OJERIO', '0966-880-3715', 'bantan, Orion, Bataan', 'Frequent Disconnections', 'Always disconnecting.', 'Afternoon (12PM - 4PM)', 'istockphoto-1214532639-612x612.jpg', '2025-08-18 02:46:37', 'Ongoing', NULL);

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
('0000000001', 'BILOLO-POST1', 13, 120.562312, 14.612766, 'Enabled'),
('0000000002', 'LATI-POST1', 15, 120.580955, 14.618210, 'Enabled'),
('0000000003', 'BILOLO-POST2', 15, 120.561964, 14.613971, 'Enabled'),
('0000000004', 'SABATAN-POST1', 13, 120.568364, 14.615012, 'Enabled'),
('0000000005', 'WAWA-POST1', 14, 120.583871, 14.623806, 'Enabled'),
('0000000006', 'BANTAN-POST1', 14, 120.572594, 14.648501, 'Enabled');

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
(1, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'PayPal', 0.00, 1799.00, '2025-05-12 00:00:00', '37J73129CJ440650A', '{\"id\":\"37J73129CJ440650A\",\"status\":\"COMPLETED\",\"amount\":\"1799.00\"}', 'Viewed', NULL),
(2, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 160.00, '2025-05-13 01:47:50', '8293 081 389623', '682288a6541c6491219887_1203006901527316_4438388944262983365_n.jpg', 'Viewed', 'the image is blurry please try again to reuploaded it'),
(3, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 160.00, '2025-05-13 01:49:48', '9785 478 897592', '6822891cc35ebgcash_qrcode.jpg', 'Viewed', NULL),
(4, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Onsite', 0.00, 50.00, '2025-05-13 00:00:00', 'N/A', 'Onsite Payment', 'Viewed', NULL),
(5, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'PayPal', 0.00, 1000.00, '2025-05-13 00:00:00', '6WT70228SL302281L', '{\"id\":\"6WT70228SL302281L\",\"status\":\"COMPLETED\",\"amount\":\"1000.00\"}', 'Viewed', NULL),
(6, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1000.00, '2025-05-13 16:10:29', '3894 834 333344', '682352d5613dd491219887_1203006901527316_4438388944262983365_n.jpg', 'Viewed', NULL),
(7, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1000.00, '2025-05-14 00:24:12', '7897 978 989898', '6823c68cabaeftestid.jpg', 'Viewed', 'testing kung gagana ung gcash na isa'),
(8, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1000.00, '2025-05-14 00:32:05', '3745 893 485798', '6823c86503245testid.jpg', 'Viewed', NULL),
(18, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'Onsite', 0.00, 1799.00, '2025-06-29 17:02:14', 'REF68610116E6947', 'Onsite Payment', 'Viewed', NULL),
(19, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'PayPal', 0.00, 1799.00, '2025-07-07 00:00:00', '1LC5689090450584U', '{\"id\":\"1LC5689090450584U\",\"status\":\"COMPLETED\",\"amount\":\"1799.00\"}', 'Viewed', NULL),
(20, '0000000004', 'APRIL HERAMIS', 'Silver', 'PayPal', 0.00, 1499.00, '2025-08-13 06:49:57', '9G686371J8497174X', '{\"id\":\"9G686371J8497174X\",\"status\":\"COMPLETED\",\"amount\":\"1499.00\",\"payer_id\":\"QRFEVQBZQ8JUG\",\"capture_id\":\"3B696586S3988914D\"}', 'Paid', NULL),
(21, '0000000008', 'FRANKLYN SMITH', 'Silver', 'PayPal', 0.00, 1499.00, '2025-08-17 09:33:46', '1K429909KK3471432', '{\"id\":\"1K429909KK3471432\",\"status\":\"COMPLETED\",\"amount\":\"1499.00\",\"payer_id\":\"QRFEVQBZQ8JUG\",\"capture_id\":\"4PB27539ND904962Y\"}', 'Viewed', NULL),
(22, '0000000003', 'WESLEY JOSHUA PEREZ', 'Gold', 'GCash', 0.00, 1799.00, '2025-08-17 23:51:39', '5728 598 763981', '68a26b0b4f03awag.jpg', 'Pending', NULL),
(23, '0000000011', 'VIOLA OJERIO', 'Bronze', 'PayPal', 0.00, 1199.00, '2025-08-18 02:23:04', '0TX18386X98027457', '{\"id\":\"0TX18386X98027457\",\"status\":\"COMPLETED\",\"amount\":\"1199.00\",\"payer_id\":\"QRFEVQBZQ8JUG\",\"capture_id\":\"9CG971328R809810D\"}', 'Viewed', NULL),
(25, '0000000005', 'TROY MENDOZA', 'Silver', 'Onsite', 0.00, 1499.00, '2025-08-18 13:54:50', 'REF68A2C02A04197', 'Onsite Payment', 'Paid', NULL),
(26, '0000000013', 'JONATHAN BARION', 'Silver', 'PayPal', 0.00, 1499.00, '2025-08-19 10:51:52', '8BM980136J0923547', '{\"id\":\"8BM980136J0923547\",\"status\":\"COMPLETED\",\"amount\":\"1499.00\",\"payer_id\":\"QRFEVQBZQ8JUG\",\"capture_id\":\"81344828BX632412P\"}', 'Paid', NULL);

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
(3, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'No Internet Connection', 'testing', 'Progress 2', 'Progress 2', 2.00, 'John Doe', '2025-05-13 14:02:00'),
(4, 'WESLEY JOSHUA PEREZ', '0912-868-9551', 'Frequent Disconnections', 'Testing on live domain', 'Going okay so far.', 'Fixing the cable.', 3.00, 'Jess Zapata', '2025-07-28 09:25:30');

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
(6, 'Silver', 'JAYSON', 'NAVARRO', '0934-837-6849', 'lofacej256@decodewp.com', '2007-06-25', 'Drivers-License', '', 'wallpaper.jpg', 'Rented', 'Bataan', 'Orion', 'daang-bilolo', 'wallpaper.jpg', '2025-07-28', '2025-06-28 11:20:20', 'Checked', 'Checked', 'Checked', 14.619254, 120.574305, 'Denied'),
(7, 'Bronze', 'SEBASTIAN KEAN', 'PACLAON', '0976-119-4367', 'sebastiankean12@gmail.com', '2003-09-09', 'Drivers-License', '', 'new-ID-card-686692159.jpg', 'Owned', 'Bataan', 'Orion', 'sabatan', 'large-294862122.png', '2025-08-15', '2025-07-28 09:09:47', 'Checked', 'Checked', 'Checked', 14.614860, 120.564554, 'Pending'),
(8, 'Silver', 'FRANKLYN', 'SMITH', '0948-579-4867', 'mtroyfrancis@gmail.com', '2007-07-03', 'Drivers-License', '', 'animeimage.jpg', 'Rented', 'Bataan', 'Orion', 'bagumbayan', 'CCST LOGO.jpg', '2025-08-24', '2025-08-11 01:53:59', 'Checked', 'Checked', 'Checked', 14.622015, 120.580141, 'Pending'),
(9, 'Gold', 'KARINA', 'SANCHEZ', '0922-582-0141', 'karinasanchez23@gmail.com', '2003-01-10', 'Voters-ID', '21523624737', 'aftersun2.jpg', 'Owned', 'Bataan', 'Orion', 'bilolo', '312881718_524540075839184_1751987415239614785_n.jpg', '2025-09-05', '2025-08-18 00:28:49', 'Checked', 'Checked', 'Checked', 14.615172, 120.561439, 'Denied'),
(10, 'Gold', 'ERICA', 'MONTEMAYOR', '0968-341-8822', 'montemayore4e4@gmail.com', '2001-06-01', 'Passport', '', 'Screenshot 2025-08-17 182745.png', 'Owned', 'Bataan', 'Orion', 'balut', 'Screenshot 2025-08-08 160951.png', '2025-09-05', '2025-08-18 00:36:13', 'Checked', 'Checked', 'Checked', 14.623851, 120.580605, 'Denied'),
(11, 'Bronze', 'VIOLA', 'OJERIO', '0966-880-3715', 'skopaclaon@bpsu.edu.ph', '1995-08-10', 'Passport', '', '44-Free-Generic-Id-Card-Template-in-Photoshop-by-Generic-Id-Card-Template-700173483.jpg', 'Rented', 'Bataan', 'Orion', 'bantan', '44-Free-Generic-Id-Card-Template-in-Photoshop-by-Generic-Id-Card-Template-700173483.jpg', '2025-08-23', '2025-08-18 01:53:21', 'Checked', 'Checked', 'Checked', 14.590000, 121.000000, 'Pending'),
(12, 'Bronze', 'KURT', 'COBAIN', '0968-123-1211', 'troymendoza099@gmail.com', '1996-08-01', 'Passport', '214251362475384', 'mononoke.png', 'Owned', 'Bataan', 'Orion', 'bilolo', 'mononoke.png', '2025-09-12', '2025-08-18 07:09:02', 'Checked', 'Checked', 'Checked', 14.616049, 120.563177, 'Denied'),
(13, 'Silver', 'JONATHAN', 'BARION', '0989-389-2323', 'wesleyjoshuaperez@gmail.com', '2007-08-01', 'Passport', '', 'id id.png', 'Rented', 'Bataan', 'Orion', 'bilolo', '515440261_1160256179477713_3040547872935918090_n.jpg', '2025-09-12', '2025-08-18 13:49:33', 'Checked', 'Checked', 'Checked', 14.612423, 120.562380, 'Approved');

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
(8, 'L1VOAM2CNZ', 'katerezada0120@gmail.com', '2025-07-18 13:12:50', '0000000002', 'user'),
(9, 'N1CTVAPBML', 'wesleyjoshuaperez.iskolar@gmail.com', '2025-07-18 13:40:21', '0000000003', 'user'),
(10, 'AJ0NI3KSH8', 'wesleyjoshuaperez.iskolar@gmail.com', '2025-07-18 13:42:32', '0000000003', 'user'),
(11, 'YAVFKTCX8M', 'perezwesley17@gmail.com', '2025-07-18 13:43:35', '0000000004', 'user'),
(16, 'I0JYLDR5U4', 'wesleyjoshuaperez.iskolar@gmail.com', '2025-08-18 02:43:34', '0000000003', 'user');

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
  MODIFY `change_plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `completion_report`
--
ALTER TABLE `completion_report`
  MODIFY `completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `progress_reports`
--
ALTER TABLE `progress_reports`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `resetpass_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

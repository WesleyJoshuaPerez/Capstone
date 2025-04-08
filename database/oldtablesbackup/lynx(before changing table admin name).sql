-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2025 at 08:34 AM
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
(1, 'wesleyperez', '2004wesley', 'Wesley Joshua Perez', 'wjhperez@bpsu.edu.ph', '09300864398', '2025-03-10 03:54:22');

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
(15, 'WJperez01', 'wesperez17', 'silver', 1499, 'WESLEY JOSHUA PEREZ', '2007-03-01', 'duale, limay, bataan', '09380868921', 'wesleyjoshuaperez@gmail.com', 'passport', '', 'idexample.jfif', 'por.jpg', 'Owned', '2025-03-28', '2025-03-27'),
(16, 'Wperez jr14', 'Znx!lh9E', 'bronze', 1199, 'WILFREDO PEREZ JR', '1970-12-14', 'bilolo, orion, bataan', '09389234373', 'wilfredoperez@gmail.com', 'drivers-license', '', 'davidid.jfif', 'residency.png', 'Owned', '2025-03-16', '2025-03-28'),
(17, 'Spaclaon01', 'sebastianpaclaon23', 'silver', 1499, 'SEBASTIAN PACLAON', '2007-03-01', 'duale, limay, bataan', '09380868921', 'wesleyjoshuaperez.iskolar@gmail.com', 'passport', '', 'davidid.jfif', 'por.jpg', 'Rented', '2025-03-28', '2025-03-09'),
(19, 'Krezada20', 'Rezada20', 'gold', 1799, 'KATE REZADA', '2003-11-20', 'duale, limay, bataan', '09961680320', 'katerezada0120@gmail.com', 'philhealth-id', '', 'Paps Valid ID.jpg', 'cat.png', 'Rented', '2025-03-28', '2025-03-27');

-- --------------------------------------------------------

--
-- Table structure for table `change_plan_application`
--

CREATE TABLE `change_plan_application` (
  `change_plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `current_plan` varchar(50) NOT NULL,
  `new_plan` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` text NOT NULL DEFAULT 'pending',
  `approved_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `change_plan_application`
--

INSERT INTO `change_plan_application` (`change_plan_id`, `user_id`, `full_name`, `current_plan`, `new_plan`, `price`, `changed_at`, `status`, `approved_date`) VALUES
(1, 19, 'KATE REZADA', 'bronze', 'gold', 1799.00, '2025-03-28 11:21:45', 'Approved', '2025-03-28');

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
(1, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', '2025-04-30 10:47:00', 'asdasd', 'asdad', 'asda', 'asdasd', 'John Doe', '2025-04-03 11:47:24'),
(2, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', '2025-04-24 19:56:00', 'sdad', 'asda', 'asda', 'asd', 'John Doe', '2025-04-03 11:53:25'),
(3, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', '0000-00-00 00:00:00', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe', '2025-04-03 14:15:25'),
(4, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', '2025-04-22 11:05:00', 'mejo final test', 'mejo final test', 'mejo final test', 'mejo final test', 'John Doe', '2025-04-03 15:02:18'),
(5, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'asdasd', '2025-04-04 19:15:00', 'Done', 'none', 'sds', 'sdsdsd', 'Emily Davis', '2025-04-04 11:15:40');

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
  `status` enum('Available','Busy','On Leave') DEFAULT 'Available',
  `profile_image` varchar(255) DEFAULT 'default_profile.jpg',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lynx_technicians`
--

INSERT INTO `lynx_technicians` (`technician_id`, `name`, `username`, `password`, `role`, `contact`, `status`, `profile_image`, `created_at`) VALUES
(1, 'John Doe', 'johndoe', 'newpass123', 'Installer', '09123456789', 'Available', 'john_doe.png', '2025-03-19 06:47:27'),
(2, 'Jane Smith', 'janesmith', 'janesmith123', 'Repair Technician', '09234567890', 'Available', 'jane_smith.png', '2025-03-19 06:47:27'),
(3, 'Michael Johnson', 'michaeljohnson', 'michaeljohnson123', 'Installer', '09345678901', 'Available', 'michael_johnson.png', '2025-03-19 06:47:27'),
(4, 'Emily Davis', 'emilydavis', 'emilydavis123', 'Repair Technician', '09456789012', 'Available', 'emily_davis.png', '2025-03-19 06:47:27'),
(5, 'Robert Brown', 'robertbrown', 'robertbrown123', 'Installer', '09567890123', 'Available', 'robert_brown.png', '2025-03-19 06:47:27');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `maintenance_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `issue_type` varchar(50) NOT NULL,
  `issue_description` text NOT NULL,
  `contact_time` varchar(50) NOT NULL,
  `evidence_filename` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `technician_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_requests`
--

INSERT INTO `maintenance_requests` (`maintenance_id`, `user_id`, `full_name`, `contact_number`, `address`, `issue_type`, `issue_description`, `contact_time`, `evidence_filename`, `submitted_at`, `status`, `technician_name`) VALUES
(1, 19, 'KATE REZADA', '09961680320', 'duale, limay, bataan', 'Frequent Disconnections', 'dsfsdf', 'Afternoon (12PM - 4PM)', 'Level0Diagram.png', '2025-03-28 10:44:58', 'Assigned', 'John Doe'),
(2, 19, 'KATE REZADA', '09961680320', 'duale, limay, bataan', 'Billing Concerns', 'asdasdas', 'Afternoon (12PM - 4PM)', 'REZADA_Badge.png', '2025-03-28 10:45:55', 'Assigned', 'John Doe'),
(6, 19, 'KATE REZADA', '09961680320', 'duale, limay, bataan', 'Frequent Disconnections', 'asdasd', 'Afternoon (12PM - 4PM)', 'ref.png', '2025-03-28 12:15:15', 'Assigned', 'Emily Davis'),
(7, 17, 'SEBASTIAN PACLAON', '09380868921', 'duale, limay, bataan', 'No Internet Connection', 'sebastian12', 'Evening (4PM - 8PM)', 'gundam.png', '2025-04-04 11:04:36', 'Assigned', 'John Doe'),
(8, 16, 'WILFREDO PEREZ JR', '09389234373', 'bilolo, orion, bataan', 'Router/Modem Issues', 'mahina net', 'Afternoon (12PM - 4PM)', 'Screenshot (76).png', '2025-04-06 06:22:27', 'Assigned', 'John Doe');

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
(1, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', 'asd', 'sadsa', 2.00, 'John Doe', '2025-04-03 11:31:59'),
(2, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', 'asdas', 'asdas', 2.00, 'John Doe', '2025-04-03 14:35:57'),
(3, 'KATE REZADA', '09961680320', 'Billing Concerns', 'asdasdas', 'sample', 'sample', 2.00, 'John Doe', '2025-04-03 14:55:47'),
(4, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', 'mejo final test', 'mejo final test', 2.00, 'John Doe', '2025-04-03 15:01:40'),
(5, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'dsfsdf', 'mejo mejo final', 'mejo mejo final', 2.00, 'John Doe', '2025-04-03 15:04:20'),
(6, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'asdasd', 'sdsd', 'sdsdsd', 2.50, 'Emily Davis', '2025-04-04 09:11:52'),
(7, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'asdasd', 'this is the update', 'can be done', 1.00, 'Emily Davis', '2025-04-04 09:46:29'),
(8, 'SEBASTIAN PACLAON', '09380868921', 'No Internet Connection', 'sebastian12', 'pcket loss net to chnge modem', 'note finish witing for order of modem', 0.50, 'John Doe', '2025-04-04 11:06:56'),
(9, 'SEBASTIAN PACLAON', '09380868921', 'No Internet Connection', 'sebastian12', 'sdsdsdsdsd', 'sdsd', 0.50, 'John Doe', '2025-04-04 11:07:40'),
(10, 'KATE REZADA', '09961680320', 'Frequent Disconnections', 'asdasd', 'none', 'sdsd', 0.50, 'Emily Davis', '2025-04-04 11:12:02'),
(11, 'WILFREDO PEREZ JR', '09389234373', 'Router/Modem Issues', 'mahina net', 'checking the modem', 'will go back tomorrow for replacing the modem', 1.00, 'John Doe', '2025-04-06 06:27:00');

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
(18, 'silver', 'TROY', 'MENDOZA', '09300864398', 'troymendoza@gmail.com', '2007-03-04', 'drivers-license', '', 'davidid.jfif', 'Rented', 'bataan', 'orion', 'sto.-domingo', 'residency.png', '2025-03-24', '2025-03-19 01:49:58', 'Checked', 'Checked', 'Checked', 'Denied'),
(19, 'silver', 'KATE', 'REZADA', '09054627399', 'katerezada0120@gmail.com', '2003-11-20', 'philhealth-id', '', 'Paps Valid ID.jpg', 'Rented', 'bataan', 'limay', 'duale', 'cat.png', '2025-03-25', '2025-03-20 10:35:35', 'Checked', 'Checked', 'Checked', 'Approved'),
(20, 'silver', 'RODRIGO', 'RODRIGUEZ', '09817687460', 'ogirdor1016@gmail.com', '2003-01-10', 'passport', '', '6085900.jpg', 'Rented', 'bataan', 'orion', 'sto.-domingo', '6496648.jpg', '2025-04-04', '2025-03-27 01:57:20', 'Checked', 'Checked', 'Checked', 'Pending'),
(24, 'Gold', 'DEAN', 'JARVIS', '09054627399', 'katerezada0120@gmail.com', '2007-03-13', 'UMID', '', 'boss_baby.jfif', 'Owned', 'Bataan', 'Orion', 'sto.-domingo', 'boss_baby.jfif', '2025-04-28', '2025-03-28 11:42:54', 'Checked', 'Checked', 'Checked', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `resetpass_request`
--

CREATE TABLE `resetpass_request` (
  `resetpass_request_id` int(11) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resetpass_request`
--

INSERT INTO `resetpass_request` (`resetpass_request_id`, `reset_token`, `email_address`, `request_date`, `user_id`, `role`) VALUES
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
-- AUTO_INCREMENT for table `admin_lynx`
--
ALTER TABLE `admin_lynx`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `change_plan_application`
--
ALTER TABLE `change_plan_application`
  MODIFY `change_plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `completion_report`
--
ALTER TABLE `completion_report`
  MODIFY `completion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lynx_technicians`
--
ALTER TABLE `lynx_technicians`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `progress_reports`
--
ALTER TABLE `progress_reports`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `resetpass_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

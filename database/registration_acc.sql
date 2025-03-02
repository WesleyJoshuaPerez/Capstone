-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2025 at 03:33 AM
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
  `id_photo_consent` varchar(10) NOT NULL DEFAULT 'Unchecked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registration_acc`
--

INSERT INTO `registration_acc` (`id`, `subscription_plan`, `first_name`, `last_name`, `contact_number`, `email_address`, `birth_date`, `id_type`, `id_number`, `id_photo`, `home_ownership_type`, `province`, `municipality`, `barangay`, `proof_of_residency`, `installation_date`, `registration_date`, `terms_agreed`, `data_processing_consent`, `id_photo_consent`) VALUES
(1, 'silver', 'kate', 'rezada', '09054627399', 'katerezada0120@gmail.com', '2007-03-01', 'drivers-license', '', 'uploads/yNdMmf8.jpg', 'Rented', 'bataan', 'limay', 'alangan', 'uploads/yNdMmf8.jpg', '2025-03-19', '2025-03-02 02:22:58', 'Checked', 'Checked', 'Checked'),
(2, 'silver', 'kate', 'rezada', '09054627399', 'katerezada0120@gmail.com', '2007-03-02', 'drivers-license', '', 'uploads/yNdMmf8.jpg', 'Rented', 'bataan', 'limay', 'kitang', 'uploads/yNdMmf8.jpg', '2025-03-14', '2025-03-02 02:27:07', 'Checked', 'Checked', 'Checked');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `registration_acc`
--
ALTER TABLE `registration_acc`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `registration_acc`
--
ALTER TABLE `registration_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

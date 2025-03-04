-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2025 at 03:48 AM
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
-- Table structure for table `resetpass_request`
--

CREATE TABLE `resetpass_request` (
  `id` int(11) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resetpass_request`
--

INSERT INTO `resetpass_request` (`id`, `reset_token`, `email_address`, `request_date`, `user_id`) VALUES
(19, '9LP46F2NG1', 'kelodoy434@lassora.com', '2025-03-03 03:15:49', 17),
(20, '2WXM5Y9URQ', 'kelodoy434@lassora.com', '2025-03-03 03:25:02', 17),
(21, '1F0VKXROIU', 'kelodoy434@lassora.com', '2025-03-03 03:33:54', 17),
(22, 'D41JHFCQLR', 'kelodoy434@lassora.com', '2025-03-03 07:18:47', 17),
(23, 'Y0QGFMHJ78', 'kelodoy434@lassora.com', '2025-03-03 07:23:58', 17),
(24, '32V65FY0N9', 'kelodoy434@lassora.com', '2025-03-03 07:27:43', 17),
(25, 'YRJXE8M36Q', 'kelodoy434@lassora.com', '2025-03-03 07:27:48', 17),
(26, 'ZJHPDB4AE2', 'kelodoy434@lassora.com', '2025-03-03 07:37:13', 17),
(27, '5WE1DOHU27', 'kelodoy434@lassora.com', '2025-03-03 07:42:53', 17),
(28, 'RIYOAT64XK', 'kelodoy434@lassora.com', '2025-03-03 19:25:34', 17),
(29, 'BF1PN74D3X', 'kelodoy434@lassora.com', '2025-03-03 19:32:02', 17);

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `resetpass_request`
--
ALTER TABLE `resetpass_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

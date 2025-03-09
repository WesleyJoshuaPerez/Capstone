-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 09, 2025 at 11:59 AM
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
(15, 'WJperez01', 'M7^zXdt%', 'bronze', 1199, 'WESLEY JOSHUA PEREZ', '2007-03-01', 'duale, limay, bataan', '09380868921', 'wesleyjoshuaperez@gmail.com', 'passport', '', 'idexample.jfif', 'por.jpg', 'Owned', '2025-03-23', '2025-03-09'),
(17, 'Spaclaon01', 'Nd9^y0iQ', 'gold', 1799, 'SEBASTIAN PACLAON', '2007-03-01', 'duale, limay, bataan', '09380868921', 'wesleyjoshuaperez.iskolar@gmail.com', 'passport', '', 'davidid.jfif', 'por.jpg', 'Rented', '2025-03-17', '2025-03-09');

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

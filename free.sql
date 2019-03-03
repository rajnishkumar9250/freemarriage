-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2017 at 04:43 AM
-- Server version: 5.7.14
-- PHP Version: 7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `free`
--

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `sendby` varchar(50) NOT NULL,
  `sendto` varchar(50) NOT NULL,
  `senddate` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `message`, `sendby`, `sendto`, `senddate`) VALUES
(1, 'soja', '5821dd6ef1de0c28116189b2', '58ce20386675a2ac22052838', '2016-12-28 23:19:20'),
(2, ' yeah soungi', '5821dd6ef1de0c28116189b2', '58214fd6d9bcdf3c0dcdf4d1', '2016-12-28 23:21:20'),
(3, 'haan  soja', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2016-12-28 23:21:46'),
(4, 'kya bol', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2016-12-29 10:18:32'),
(5, 'kya bol', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2016-12-29 10:19:04'),
(6, 'kuch nae , main karungi', '5821dd6ef1de0c28116189b2', '58214fd6d9bcdf3c0dcdf4d1', '2016-12-29 10:19:31'),
(7, 'haan sahi h .. u should try urself', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2016-12-29 10:19:56'),
(8, 'kya re', '5821dd14f1de0c28116189b1', '58214fd6d9bcdf3c0dcdf4d1', '2016-12-29 10:22:22'),
(9, 'hey anusha ', '5821dd6ef1de0c28116189b2', '5821dd14f1de0c28116189b1', '2016-12-29 10:22:48'),
(10, 'hi ram , gm :)', '5821dd14f1de0c28116189b1', '5821dd6ef1de0c28116189b2', '2016-12-29 10:23:21'),
(11, 'good morning anu', '5821dd6ef1de0c28116189b2', '5821dd14f1de0c28116189b1', '2016-12-29 10:23:54'),
(12, 'hi Anusha', '58214fd6d9bcdf3c0dcdf4d1', '5821dd14f1de0c28116189b1', '2017-01-05 00:41:32'),
(13, 'Hii Rajnish', '5821dd14f1de0c28116189b1', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-05 00:41:48'),
(14, 'how are u ??', '58214fd6d9bcdf3c0dcdf4d1', '5821dd14f1de0c28116189b1', '2017-01-05 00:42:01'),
(15, 'i m fine and u ??', '5821dd14f1de0c28116189b1', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-05 00:42:26'),
(16, 'i m also good', '58214fd6d9bcdf3c0dcdf4d1', '5821dd14f1de0c28116189b1', '2017-01-05 00:42:56'),
(17, 'kya kr rhi h ?? had ur dinner??', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-01-10 22:25:17'),
(18, 'kuch nae, av just had dinner,, tu ??', '5821dd6ef1de0c28116189b2', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-10 22:28:45'),
(19, 'haan soungi .. tu v soja re', '5821dd6ef1de0c28116189b2', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-10 22:31:11'),
(20, 'kya re', '5821dd6ef1de0c28116189b2', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-10 22:34:34'),
(21, 'kya re kya kr rha h ??', '5821dd6ef1de0c28116189b2', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-10 22:39:49'),
(22, 'kya kr rhi h ?', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-01-10 22:45:26'),
(23, 'hi', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-01-11 21:43:19'),
(24, 'hi', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-01-11 21:50:11'),
(25, 'hi', '58214fd6d9bcdf3c0dcdf4d1', '5821dd14f1de0c28116189b1', '2017-01-11 21:50:26'),
(26, 'so gae', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-01-11 23:46:54'),
(27, 'soja good night', '58ce20386675a2ac22052838', '58214fd6d9bcdf3c0dcdf4d1', '2017-01-11 23:56:35'),
(28, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:40'),
(29, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:41'),
(30, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:41'),
(31, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:41'),
(32, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:41'),
(33, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:41'),
(34, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:42'),
(35, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:42'),
(36, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:42'),
(37, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:42'),
(38, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:42'),
(39, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:42'),
(40, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:43'),
(41, '', '58214fd6d9bcdf3c0dcdf4d1', '5821dd6ef1de0c28116189b2', '2017-07-04 10:26:43'),
(42, 'hi rajju', '58ce20386675a2ac22052838', '58214fd6d9bcdf3c0dcdf4d1', '2017-07-15 21:47:10'),
(43, 'hi Paro', '58214fd6d9bcdf3c0dcdf4d1', '58ce20386675a2ac22052838', '2017-07-15 21:47:29'),
(44, 'kaisi h ?', '58214fd6d9bcdf3c0dcdf4d1', '58ce20386675a2ac22052838', '2017-07-15 21:48:06'),
(45, 'bol ?', '58214fd6d9bcdf3c0dcdf4d1', '58ce20386675a2ac22052838', '2017-07-15 21:48:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

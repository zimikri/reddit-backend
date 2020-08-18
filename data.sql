SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `reddit`
--

USE `reddit`;

-- --------------------------------------------------------

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`title`, `url`, `timestamp`, `score`, `user_id`) VALUES 
('Dear JavaScript', 'http://9gag.com', '1494339525', 791, 1),
('Crockford', 'http://9gag.com', '1494138425', 567, 2);

--
-- Dumping data for table `user`
--

INSERT INTO `user` VALUES 
(1, 'krisz'),
(2, 'Crockford');


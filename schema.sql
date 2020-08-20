SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `reddit`
--

CREATE SCHEMA IF NOT EXISTS `reddit` DEFAULT CHARACTER SET utf8;

USE `reddit`;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--
DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `url` varchar(150) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `timestamp` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `score` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `vote`s
--
DROP TABLE IF EXISTS `votes`;
CREATE TABLE IF NOT EXISTS `votes` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vote` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

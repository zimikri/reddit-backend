SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `reddit`
--

CREATE SCHEMA IF NOT EXISTS `reddit` DEFAULT CHARACTER SET utf8;

USE `reddit`;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--
DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL DEFAULT '',
    `url` VARCHAR(150) NOT NULL DEFAULT '',
    `timestamp` INT NOT NULL,
    `user_id` INT NOT NULL DEFAULT 0,
    `score` INT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
);

--
-- Table structure for table `user`
--
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user2` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`),
    UNIQUE INDEX (`username`)
);

--
-- Table structure for table `vote`
--
DROP TABLE IF EXISTS `vote`;
CREATE TABLE IF NOT EXISTS `vote` (
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `vote` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`post_id`, `user_id`)
);
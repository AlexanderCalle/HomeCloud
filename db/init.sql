CREATE TABLE IF NOT EXISTS `users` (
    id VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) not null,
    password_hash VARCHAR(255) NOT NULL,
    folder_path VARCHAR(255),
    profile_picture VARCHAR(255) DEFAULT NULL,
    resetPasswordCode INT(7),
    resetPasswordExpired DATETIME,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS `folders` (
    folder_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    main_path VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    primary key (folder_id),
    FOREIGN KEY (user_id) REFERENCES `users`(id)
);

CREATE TABLE IF NOT EXISTS `files` (
    file_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255),
    is_image BOOLEAN NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    folder_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (file_id),
    FOREIGN KEY (user_id) REFERENCES `users`(id),
    FOREIGN KEY (folder_id) REFERENCES `folders`(folder_id)
);

CREATE TABLE IF NOT EXISTS `friends` (
    `FriendsId` INT(11) NOT NULL AUTO_INCREMENT,
    `UserOne` VARCHAR(255) NOT NULL,
    `UserTwo` VARCHAR(255) NOT NULL,
    `Status` INT(3) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`FriendsId`)
);

CREATE TABLE IF NOT EXISTS `chats` (
	chatId int(11) NOT NULL AUTO_INCREMENT,
	userOne VARCHAR(255) NOT NULL,
	userTwo VARCHAR(255) NOT NULL,
	PRIMARY KEY (chatId)
);

CREATE TABLE IF NOT EXISTS `messages` (
	message_id INT(11) NOT NULL AUTO_INCREMENT,
    chatId INT(11) NOT NULL,
	fromUser VARCHAR(255) NOT NULL,
	toUser VARCHAR(255) NOT NULL,
	message LONGTEXT NOT NULL,
    isImage TINYINT NOT NULL DEFAULT 0,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`Status` TINYINT NOT NULL DEFAULT 0,
	PRIMARY KEY (message_id),
    FOREIGN KEY (chatId) REFERENCES `chats`(chatId)
);


CREATE TABLE `shared` (
	shared_id INT(11) NOT NULL AUTO_INCREMENT,
	shared_file INT(11) NOT NULL,
	user_file VARCHAR(255) NOT NULL,
	shared_user VARCHAR(255) NOT NULL,
	shared_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (shared_id),
	FOREIGN KEY (shared_file) REFERENCES `files`(file_id)
);
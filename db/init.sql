CREATE TABLE IF NOT EXISTS `users` (
    id VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) not null,
    password_hash VARCHAR(255) NOT NULL,
    folder_path VARCHAR(255),
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
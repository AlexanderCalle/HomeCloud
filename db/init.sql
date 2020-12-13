CREATE TABLE IF NOT EXISTS `users` (
    id VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) not null,
    password_hash VARCHAR(255) NOT NULL,
    folder_path VARCHAR(255),
    PRIMARY KEY(id),
)
ALTER TABLE messages
ADD isImage TINYINT NOT NULL DEFAULT 0;

INSERT INTO folders set folder_id = 0, name = "chat", main_path = "/", user_id = "0";
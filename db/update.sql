ALTER TABLE messages
ADD isImage TINYINT NOT NULL DEFAULT 0;

INSERT INTO users set id = "0", firstname = "admin", lastname = "admin", email = "admin@admin.com", password_hash = "nqmljflmsqjdf";
INSERT INTO folders set folder_id = -1, name = "chat", main_path = "/", user_id = "0";
UPDATE folders SET folder_id = 0 WHERE folder_id = -1;
--- SQL create table

CREATE TABLE role (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(120) NOT NULL,
  code varchar(120) NOT NULL
);
-- 1-1, 1-M, M-1, M-M 
INSERT INTO role (name,code) VALUES  
('Admin','admin'),
('Manager','Manager'),
('Account','Account'),
('Cashier','Cashier');

CREATE TABLE user (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  role_id int(11) DEFAULT NULL, -- FK
  name varchar(120) DEFAULT NULL,
  username varchar(255) NOT NULL UNIQUE ,
  password varchar(255) DEFAULT NULL,
  is_active tinyint(1) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

ALTER TABLE user
ADD FOREIGN KEY (role_id) REFERENCES role(id);

u.(role_id) = r.(id);

-- Assign 
-- role(1) - user(M) // 1-M, M-1
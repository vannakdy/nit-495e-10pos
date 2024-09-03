

CREATE TABLE role (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(120) NOT NULL,
  code varchar(255) NOT NULL
);


CREATE TABLE user (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  role_d int(11) DEFAULT NULL,
  name varchar(120) DEFAULT NULL,
  username varchar(255) NOT NULL UNIQUE ,
  password varchar(255) DEFAULT NULL,
  is_active tinyint(1) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);
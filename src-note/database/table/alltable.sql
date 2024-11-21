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

CREATE TABLE category (
  id int(11) NOT NULL,
  name varchar(255) NOT NULL,
  description text DEFAULT NULL,
  status tinyint(1) NOT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

INSERT INTO `category` (`id`, `name`, `description`, `status`, `create_at`) VALUES
(1, 'Computer', 'Desc Computer', 1, '2024-05-27 14:54:34'),
(2, 'Phone', 'Desc Phone', 1, '2024-05-27 14:55:37'),
(3, 'Monitor', 'Desc Monitor', 0, '2024-05-27 14:56:15'),
(4, 'Printer', 'Desc Printer', 0, '2024-05-27 14:58:06'),
(5, 'LED', 'Desc LED', 1, '2024-05-27 14:58:06');

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

-- new 

CREATE TABLE customer (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(120) NOT NULL,
  tel varchar(18) NOT NULL UNIQUE ,
  email varchar(120) DEFAULT NULL ,
  address text DEFAULT NULL,
  type varchar(120) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE supplier (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(18) NOT NULL,
  code varchar(18) NOT NULL UNIQUE ,
  tel varchar(18) NOT NULL UNIQUE ,
  email varchar(120) DEFAULT NULL ,
  address text DEFAULT NULL,
  website varchar(120) DEFAULT NULL,
  note text DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE product (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  category_id int(11) NOT NULL,
  barcode varchar(120) NOT NULL,
  name varchar(120) NOT NULL,
  brand varchar(120) NOT NULL,
  description text DEFAULT NULL ,
  qty int(6) DEFAULT 0 NOT NULL ,
  price DECIMAL(7,2) DEFAULT 0 NOT NULL ,
  discount DECIMAL(3,2) DEFAULT 0 NOT NULL,
  status tinyint(1) DEFAULT 0,
  image varchar(255) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE product_image (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id int(11),
  image varchar(255) NOT NULL,
);

CREATE TABLE order (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_no varchar(120) NOT NULL,
  customer_id int(11) DEFAULT NULL,
  user_id int(11) DEFAULT NULL,
  paid_amount  DECIMAL(7,2) DEFAULT 0 NOT NULL ,
  payment_method varchar(120) NOT NULL,
  remark text DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE order_detail (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_id int(11),
  proudct_id  int(11) ,
  qty  int(6) DEFAULT 0,
  price DECIMAL(7,2) DEFAULT 0,
  discount DECIMAL(7,2) DEFAULT 0,
  total DECIMAL(7,2) DEFAULT 0,
);

CREATE TABLE purchase (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  supplier_id int(11),
  ref  varchar(255) NOT NULL ,
  shipp_company  varchar(255) DEFAULT NULL,
  shipp_cost  DECIMAL(7,2) DEFAULT 0,
  paid_amount DECIMAL(7,2) DEFAULT 0,
  paid_date datetime,
  status varchar(120) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE purchase_product (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  purchase_id int(11),
  product_id int(11),
  qty  int(11) DEFAULT 0,
  cost DECIMAL(7,2) DEFAULT 0,
  discount DECIMAL(7,2) DEFAULT 0,
  amount DECIMAL(7,2) DEFAULT 0,
  retail_price DECIMAL(7,2) DEFAULT 0,
  remark text DEFAULT NULL, 
  status varchar(120) DEFAULT NULL, 
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE expense_type (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL ,
  code  varchar(255) NOT NULL ,
);

CREATE TABLE expense (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  expense_type_id INT(11) ,
  ref_no VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(7,2) DEFAULT 0,
  remark TEXT DEFAULT NULL,
  expense_date datetime,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);


--- 
CREATE TABLE employee (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  card_id VARCHAR(120) NOT NULL UNIQUE,
  dob datetime NOT NULL,
  gender tinyint(1) NOT NULL,
  tel VARCHAR(18) NOT NULL,
  email VARCHAR(120) DEFAULT NULL,
  base_salary DECIMAL(6,2) DEFAULT 0,
  position VARCHAR(120) NOT NULL,
  address TEXT DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp NOT NULL DEFAULT current_timestamp()
);




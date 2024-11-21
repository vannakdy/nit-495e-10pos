
-- add u UNIQUE
ALTER TABLE product
ADD CONSTRAINT p_barcode UNIQUE (barcode);

ALTER TABLE `order` ADD `total_amount` DECIMAL(6) NOT NULL DEFAULT '0' AFTER `user_id`;
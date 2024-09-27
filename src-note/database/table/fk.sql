ALTER TABLE user
ADD FOREIGN KEY (role_id) REFERENCES role(id);

ALTER TABLE product
ADD FOREIGN KEY (cat_id) REFERENCES category(id);

-- done
ALTER TABLE product_image
ADD FOREIGN KEY (product_id) REFERENCES product(id);

-- done
ALTER TABLE `order`
ADD FOREIGN KEY (customer_id) REFERENCES customer(id);

ALTER TABLE `order`
ADD FOREIGN KEY (user_id) REFERENCES user(id);

-- done
ALTER TABLE `order_detail` 
ADD FOREIGN KEY (order_id) REFERENCES `order`(id);

ALTER TABLE `order_detail`
ADD FOREIGN KEY (proudct_id) REFERENCES product(id);

ALTER TABLE `purchase`
ADD FOREIGN KEY (supplier_id) REFERENCES supplier(id);


ALTER TABLE `purchase_product`
ADD FOREIGN KEY (purchase_id) REFERENCES purchase(id);
ALTER TABLE `purchase_product`
ADD FOREIGN KEY (product_id) REFERENCES product(id);


ALTER TABLE `expense`
ADD FOREIGN KEY (expense_type_id) REFERENCES expense_type(id);





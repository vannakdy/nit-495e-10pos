
-- add u UNIQUE
ALTER TABLE product
ADD CONSTRAINT p_barcode UNIQUE (barcode);
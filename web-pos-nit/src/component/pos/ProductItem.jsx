import { Button, Image } from "antd";
import React from "react";
import { Config } from "../../util/config";
import styles from "./ProductItem.module.css";
import { MdAddCircle } from "react-icons/md";

function ProductItem({
  id,
  name,
  description,
  image,
  category_name,
  brand,
  price,
  discount,
  barcode,
  handleAdd,
}) {
  var final_price = price;
  if (discount != 0 && discount != null) {
    final_price = price - (price * discount) / 100;
    final_price = final_price.toFixed(2);
  }
  return (
    <div className={styles.contianer}>
      <Image src={Config.image_path + image} alt={name} />
      <div className={styles.p_name + " truncate-text"}>{name}</div>
      <div className={styles.p_des}>
        {barcode} | {category_name} | {brand}
      </div>
      <div className={styles.p_des}>{description}</div>
      {discount != 0 && discount != null ? (
        <div className={styles.p_price_container}>
          <div className={styles.p_price}>{price}$</div>
          <div className={styles.p_dis}> {discount}%</div>
          <div className={styles.p_final_price}> {final_price}$</div>
        </div>
      ) : (
        <div className={styles.p_price_container}>
          <div className={styles.p_final_price}> {price}$</div>
        </div>
      )}
      <div className={styles.btnAddContainer}>
        <Button onClick={handleAdd} type="primary" icon={<MdAddCircle />} />
      </div>
    </div>
  );
}

export default ProductItem;

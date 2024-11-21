import { Col, Flex, Row } from "antd";
import React from "react";
import { formatDateClient } from "../../util/helper";
import logo from "../../assets/INT_LOGO.png";

const PrintInvoice = React.forwardRef((props, ref) => {
  const findTotalItem = (item) => {
    let total = item.cart_qty * item.price;
    if (item.discount) {
      let discount_price = (total * item.discount) / 100;
      total = total - discount_price;
    }
    return total.toFixed(2);
  };
  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        padding: "5px",
        fontFamily: "monospace",
        fontSize: "10px",
      }}
    >
      <Flex align="center">
        <img
          src={logo}
          alt=""
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            borderRadius: 15,
          }}
        />
        <div>
          <div style={{ fontWeight: "bold" }}>NIT COMPUTER SHOP</div>
          <div style={{ fontSize: 9 }}>Address : TK</div>
        </div>
      </Flex>
      <hr />

      <div style={{ marginBottom: 15, marginTop: 5 }}>
        {props.objSummary?.order_no} |{" "}
        {formatDateClient(props.objSummary?.order_date, "DD/MM/YYYY h:mm ss A")}
      </div>
      <table className="pos_tbl_invoice">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Dis(%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {props.cart_list?.map((item, index) => (
            <tr>
              <td style={{ width: "40mm" }}>{item.name}</td>
              <td>{item.cart_qty}</td>
              <td>{item.price}$</td>
              <td>{item.discount}</td>
              <td>{findTotalItem(item)}$</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div className={"row_between_invoice"}>
          <div>Total Qty </div>
          <div>{props?.objSummary.total_qty}PCS</div>
        </div>
        <div className={"row_between_invoice"}>
          <div>Sub total </div>
          <div>{props?.objSummary.sub_total}$</div>
        </div>
        <div className={"row_between_invoice"}>
          <div>Save($) </div>
          <div>{props?.objSummary.save_discount}$</div>
        </div>
        <div className={"row_between_invoice"}>
          <div style={{ fontWeight: "bold" }}>Total </div>
          <div style={{ fontWeight: "bold" }}>{props?.objSummary.total}$</div>
        </div>
      </div>
      <p style={{ textAlign: "center" }}>Thank you for your purchase!</p>
    </div>
  );
});

export default PrintInvoice;

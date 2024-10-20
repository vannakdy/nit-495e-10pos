import React from "react";

const InvoiceComponent = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ width: "72mm", fontFamily: "monospace", fontSize: "12px" }}
  >
    <h2 style={{ textAlign: "center" }}>Store Name</h2>
    <p>Date: {new Date().toLocaleString()}</p>
    <hr />
    <p>Item 1 ......... $5.00</p>
    <p>Item 2 ......... $3.50</p>
    <hr />
    <p>Total: $8.50</p>
    <hr />
    <p style={{ textAlign: "center" }}>Thank you for your purchase!</p>
  </div>
));

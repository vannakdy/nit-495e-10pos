import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Empty,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import { request } from "../../util/helper";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import ProductItem from "../../component/pos/ProductItem";
import BillItem from "../../component/pos/BillItem";
import styles from "./PosPage.module.css";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../component/pos/PrintInvoice";

function PosPage() {
  const { config } = configStore();
  const refInvoice = React.useRef(null);
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
    cart_list: [],
  });

  const [objSummary, setObjSummary] = useState({
    sub_total: 0,
    total_qty: 0,
    save_discount: 0,
    tax: 10,
    total: 0,
    total_paid: 0,
    customer_id: null,
    payment_method: null,
    remark: null,

    order_no: null, // set after order
    order_date: null, // set after order
  });

  const refPage = React.useRef(1);

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    var param = {
      ...filter,
      page: refPage.current,
      is_list_all: 1,
    };
    setState((pre) => ({ ...pre, loading: true }));
    const res = await request("product", "get", param);
    if (res && !res.error) {
      if (res.list?.length == 1) {
        handleAdd(res.list[0]);
        setState((pre) => ({ ...pre, loading: false }));
        return;
      }
      setState((pre) => ({
        ...pre,
        list: res.list,
        total: refPage.current == 1 ? res.total : pre.total,
        loading: false,
      }));
    }
  };

  const onFilter = () => {
    getList();
  };

  const handleAdd = (item) => {
    var cart_tmp = state.cart_list;
    // find is exist
    var findIndex = cart_tmp.findIndex((row) => row.barcode == item.barcode); // -1 | 0 ,1 ,2
    var isNoStock = false;
    if (findIndex == -1) {
      if (item.qty > 0) {
        cart_tmp.push({ ...item, cart_qty: 1 }); //add new properties  cart_qty
      } else {
        isNoStock = true;
      }
    } else {
      cart_tmp[findIndex].cart_qty += 1; // increas qty
      if (item.qty < cart_tmp[findIndex].cart_qty) {
        isNoStock = true;
      }
    }
    // check has stock
    if (isNoStock) {
      notification.error({
        message: "Warning",
        description:
          "No stock!. Currently quantity in stock available " + item.qty,
        placement: "top",
        style: {
          backgroundColor: "hsl(359,100%,98%)",
          outline: "1px solid #ff4d4f",
        },
      });
      return;
    }
    setState((pre) => ({
      ...pre,
      cart_list: cart_tmp, //[...pre.cart_list, item], // push item array
    }));
    handleCalSummary();
  };

  const handleClearCart = () => {
    setState((p) => ({ ...p, cart_list: [] }));
    setObjSummary((p) => ({
      ...p,
      sub_total: 0,
      total_qty: 0,
      save_discount: 0,
      tax: 10,
      total: 0,
      total_paid: 0,
    }));
  };

  const handleIncrease = (item, index) => {
    state.cart_list[index].cart_qty += 1;
    setState((p) => ({ ...p, cart_list: state.cart_list }));
    handleCalSummary();
  };

  const handleDescrease = (item, index) => {
    if (item.cart_qty > 1) {
      state.cart_list[index].cart_qty -= 1;
      setState((p) => ({ ...p, cart_list: state.cart_list }));
      handleCalSummary();
    }
  };

  const handleRemove = (item, index) => {
    const new_list = state.cart_list.filter(
      (item1) => item1.barcode != item.barcode
    );
    setState((p) => ({
      ...p,
      cart_list: new_list,
    }));
    handleCalSummary();
  };

  const handleCalSummary = useCallback(() => {
    let total_qty = 0,
      sub_total = 0,
      save_discount = 0,
      total = 0,
      original_total = 0;
    state.cart_list.map((item) => {
      total_qty += item.cart_qty; // done
      // final_price ?
      var final_price = item.price;
      if (item.discount != 0 && item.discount != null) {
        final_price = item.price - (item.price * item.discount) / 100;
        final_price = final_price.toFixed(2);
      }
      // sub_total
      original_total += item.cart_qty * item.price; /// error
      sub_total += item.cart_qty * final_price;
    });
    total = sub_total; // include tax
    save_discount = original_total - sub_total;
    setObjSummary((p) => ({
      ...p,
      total_qty: total_qty,
      sub_total: sub_total.toFixed(2),
      save_discount: save_discount.toFixed(2),
      total: total.toFixed(2),
    }));
  }, [state.cart_list]);

  const handleClickOut = async () => {
    var order_details = [];
    state.cart_list.forEach((item) => {
      var total = Number(item.cart_qty) * Number(item.price);
      if (item.discount != null && item.discount != 0) {
        total = total - (total * Number(item.discount)) / 100;
      }
      var objItem = {
        proudct_id: item.id,
        qty: Number(item.cart_qty),
        price: Number(item.price),
        discount: Number(item.discount),
        total: total,
      };
      order_details.push(objItem);
    });
    var param = {
      order: {
        customer_id: objSummary.customer_id,
        total_amount: objSummary.total,
        paid_amount: objSummary.total_paid,
        payment_method: objSummary.payment_method,
        remark: objSummary.remark,
      },
      order_details: order_details,
    };
    const res = await request("order", "post", param);
    if (res && !res.error) {
      if (res.order) {
        message.success("Order created success!");
        setObjSummary((p) => ({
          ...p,
          order_no: res.order?.order_no,
          order_date: res.order?.create_at,
        }));
        setTimeout(() => {
          handlePrintInvoice(); // open print dialog
        }, 1000);
      }
    } else {
      message.success("Order not complete!");
    }
  };

  const onBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const onAfterPrint = React.useCallback((event) => {
    handleClearCart();
    console.log("`onAfterPrint` called", event);
  }, []);

  const onPrintError = React.useCallback(() => {
    console.log("`onPrintError` called");
  }, []);

  const handlePrintInvoice = useReactToPrint({
    contentRef: refInvoice,
    onBeforePrint: onBeforePrint,
    onAfterPrint: onAfterPrint,
    onPrintError: onPrintError,
  });

  return (
    <MainPage loading={state.loading}>
      <div style={{ display: "none" }}>
        <PrintInvoice
          ref={refInvoice}
          cart_list={state.cart_list}
          objSummary={objSummary}
        />
      </div>
      <Row gutter={24}>
        <Col span={16} className={styles.grid1}>
          <div className="pageHeader">
            <Space>
              <div>Product {state.total}</div>
              <Input.Search
                onChange={(event) =>
                  setFilter((p) => ({ ...p, txt_search: event.target.value }))
                }
                allowClear
                placeholder="Search"
                onSearch={() => getList()}
              />
              <Select
                allowClear
                style={{ width: 130 }}
                placeholder="Category"
                options={config.category}
                onChange={(id) => {
                  setFilter((pre) => ({ ...pre, category_id: id }));
                }}
              />
              <Select
                allowClear
                style={{ width: 130 }}
                placeholder="Brand"
                options={config.brand}
                onChange={(id) => {
                  setFilter((pre) => ({ ...pre, brand: id }));
                }}
              />
              <Button onClick={onFilter} type="primary">
                Search
              </Button>
            </Space>
          </div>
          <Row gutter={[16, 16]}>
            {state.list.map((item, index) => (
              <Col key={index} span={8}>
                <ProductItem {...item} handleAdd={() => handleAdd(item)} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={8}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Items {state.cart_list.length}</div>
            <Button onClick={handleClearCart}>Clear</Button>
          </div>
          {state.cart_list?.map((item, index) => (
            <BillItem
              key={index}
              {...item}
              handleIncrease={() => handleIncrease(item, index)}
              handleDescrease={() => handleDescrease(item, index)}
              handleRemove={() => handleRemove(item, index)}
            />
          ))}
          {!state.cart_list.length && <Empty />}
          <div>
            <div className={styles.rowSummary}>
              <div>Total Qty </div>
              <div>{objSummary.total_qty}PCS</div>
            </div>
            <div className={styles.rowSummary}>
              <div>Sub total </div>
              <div>{objSummary.sub_total}$</div>
            </div>
            <div className={styles.rowSummary}>
              <div>Save($) </div>
              <div>{objSummary.save_discount}$</div>
            </div>
            <div className={styles.rowSummary}>
              <div style={{ fontWeight: "bold" }}>Total </div>
              <div style={{ fontWeight: "bold" }}>{objSummary.total}$</div>
            </div>
          </div>
          <div>
            <Row gutter={[6, 6]} style={{ marginTop: 15 }}>
              <Col span={12}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Customer"
                  options={config?.customer}
                  onSelect={(value) => {
                    setObjSummary((p) => ({
                      ...p,
                      customer_id: value,
                    }));
                  }}
                />
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Payment"
                  options={[
                    {
                      label: "Cash",
                      value: "Cash",
                    },
                    {
                      label: "Wing",
                      value: "Wing",
                    },
                    {
                      label: "ABA",
                      value: "ABA",
                    },
                    {
                      label: "AC",
                      value: "AC",
                    },
                  ]}
                  onSelect={(value) => {
                    setObjSummary((p) => ({
                      ...p,
                      payment_method: value,
                    }));
                  }}
                />
              </Col>

              <Col span={24}>
                <Input.TextArea
                  placeholder="Remark"
                  onChange={(e) => {
                    setObjSummary((p) => ({ ...p, remark: e.target.value }));
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 15 }}>
              <Col span={12}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Amount to paid"
                  value={objSummary.total_paid}
                  onChange={(value) => {
                    setObjSummary((p) => ({ ...p, total_paid: value }));
                  }}
                />
              </Col>
              <Col span={12}>
                <Button
                  disabled={state.cart_list.length == 0}
                  block
                  type="primary"
                  onClick={handleClickOut}
                >
                  Checkout{" "}
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </MainPage>
  );
}

export default PosPage;

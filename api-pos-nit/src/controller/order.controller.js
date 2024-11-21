const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    var txtSearch = req.query.txtSearch;
    var sql = "SELECT * FROM order  ";
    if (!isEmpty(txtSearch)) {
      sql +=
        " WHERE name LIKE :txtSearch OR code LIKE :txtSearch OR tel LIKE :txtSearch OR email LIKE :txtSearch";
    }
    const [list] = await db.query(sql, {
      txtSearch: "%" + txtSearch + "%",
    });
    res.json({
      list: list,
    });
  } catch (error) {
    logError("order.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var { order, order_details = [] } = req.body;
    // validate data
    order = {
      ...order,
      order_no: await newOrderNo(), // gener order_no
      user_id: req.auth?.id, // currect access
      create_by: req.auth?.name, // currect access
    };
    var sqlOrder =
      "INSERT INTO `order` (order_no,customer_id,total_amount,paid_amount,payment_method,remark,user_id,create_by) VALUES (:order_no,:customer_id,:total_amount,:paid_amount,:payment_method,:remark,:user_id,:create_by) ";
    var [data] = await db.query(sqlOrder, order);

    order_details.map(async (item, index) => {
      // order product
      var sqlOrderDetails =
        "INSERT INTO order_detail (order_id,proudct_id,qty,price,discount,total) VALUES (:order_id,:proudct_id,:qty,:price,:discount,:total) ";
      var [dataOrderProduct] = await db.query(sqlOrderDetails, {
        ...item,
        order_id: data.insertId, // overrid key order_id
      });

      // re stock
      var sqlReStock =
        "UPDATE product SET qty = (qty-:order_qty) WHERE id = :proudct_id ";
      var [dataRestock] = await db.query(sqlReStock, {
        order_qty: item.qty,
        proudct_id: item.proudct_id,
      });
    });
    const [currentOrder] = await db.query(
      "select * from `order` where id=:id",
      {
        id: data.insertId,
      }
    );
    res.json({
      order: currentOrder.length > 0 ? currentOrder[0] : null,
      order_details: order_details,
      message: "Insert success!",
    });
  } catch (error) {
    logError("order.create", error, res);
  }
};

const newOrderNo = async (req, res) => {
  try {
    var sql =
      "SELECT " +
      "CONCAT('INV',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM `order`), 3, '0')) " +
      "as order_no";
    var [data] = await db.query(sql);
    return data[0].order_no;
  } catch (error) {
    logError("newOrderNo.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE  order set name=:name, code=:code, tel=:tel, email=:email, address=:address, website=:website, note=:note WHERE id=:id ";
    var [data] = await db.query(sql, {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Update success!",
    });
  } catch (error) {
    logError("order.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM order WHERE id = :id", {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("order.remove", error, res);
  }
};

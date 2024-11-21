const {
  db,
  isArray,
  isEmpty,
  logError,
  removeFile,
} = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    // console.log("body", req.body);
    console.log("query", req.query);
    // res.json({
    //   body: req.body,
    //   query: req.query,
    // });
    // return;
    var { txt_search, category_id, brand } = req.query;
    var sql =
      "SELECT " +
      " p.*, " +
      " c.name AS category_name " +
      " FROM product p " +
      " INNER JOIN category c ON p.category_id = c.id  " +
      " WHERE true ";
    if (txt_search) {
      sql += " AND (p.name LIKE :txt_search OR p.barcode = :barcode) ";
    }
    if (category_id) {
      sql += " AND p.category_id = :category_id";
    }
    if (brand) {
      sql += " AND p.brand = :brand";
    }

    const [list] = await db.query(sql, {
      txt_search: "%" + txt_search + "%",
      barcode: txt_search,
      category_id,
      brand,
    });
    res.json({
      list: list,
    });
  } catch (error) {
    logError("product.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    if (isExistBarcode(req.barcode)) {
      res.json({
        error: {
          barcode: "Barcode already exist.",
        },
      });
      return false;
    }
    res.json({
      body: req.body,
      message: "Insert success!",
    });
    return;
    var sql =
      " INSERT INTO product (category_id, barcode,name,brand,description,qty,price,discount,status,image,create_by ) " +
      " VALUES (:category_id, :barcode, :name, :brand, :description, :qty, :price, :discount, :status, :image, :create_by ) ";
    var [data] = await db.query(sql, {
      ...req.body,
      image: req.file?.filename,
      create_by: req.auth?.name,
    });
    res.json({
      data,
      message: "Insert success!",
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      " UPDATE product set " +
      " category_id = :category_id, " +
      " barcode = :barcode, " +
      " name = :name, " +
      " brand = :brand, " +
      " description = :description, " +
      " qty = :qty, " +
      " price = :price, " +
      " discount = :discount, " +
      " status = :status, " +
      " image = :image " +
      " WHERE id = :id";

    var filename = req.body.image;
    /// image new
    if (req.file) {
      filename = req.file?.filename;
    }

    /// image change
    if (
      req.body.image != "" &&
      req.body.image != null &&
      req.body.image != "null" &&
      req.file
    ) {
      removeFile(req.body.image); // remove old image
      filename = req.file?.filename;
    }

    /// image remove
    if (req.body.image_remove == "1") {
      removeFile(req.body.image); // remove image
      filename = null;
    }

    var [data] = await db.query(sql, {
      ...req.body,
      image: filename,
      create_by: req.auth?.name,
    });

    res.json({
      data: data,
      message: "Data update success!",
    });
  } catch (error) {
    logError("product.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM product WHERE id = :id", {
      id: req.body.id, // null
    });
    if (data.affectedRows && req.body.image != "" && req.body.image != null) {
      removeFile(req.body.image);
    }
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("remove.create", error, res);
  }
};

exports.newBarcode = async (req, res) => {
  try {
    var sql =
      "SELECT " +
      "CONCAT('P',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM product), 3, '0')) " +
      "as barcode";
    var [data] = await db.query(sql);
    res.json({
      barcode: data[0].barcode,
    });
  } catch (error) {
    logError("remove.create", error, res);
  }
};

isExistBarcode = async (barcode) => {
  try {
    var sql = "SELECT COUNT(id) as Total FROM product WHERE barcode=:barcode";
    var [data] = await db.query(sql, {
      barcode: barcode,
    });
    if (data.length > 0 && data[0].Total > 0) {
      return true; // ស្ទួន
    }
    return false; // អត់ស្ទួនទេ
  } catch (error) {
    logError("remove.create", error, res);
  }
};

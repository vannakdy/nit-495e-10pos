const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [list] = await db.query("SELECT * FROM category ORDER BY id DESC");
    res.json({
      i_know_you_are_id: req.current_id,
      list: list,
    });
  } catch (error) {
    logError("category.getList", error, res);
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
    var sql =
      " INSERT INTO product (category_id, barcode,name,brand,description,qty,price,discount,status,image,create_by ) " +
      " VALUES (:category_id, :barcode, :name, :brand, :description, :qty, :price, :discount, :status, :image, :create_by ) ";
    var [data] = await db.query(sql, {
      ...req.body,
      image: req.file?.filename,
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
    if (isExistBarcode(req.barcode)) {
      res.json({
        error: {
          barcode: "Barcode already exist.",
        },
      });
      return false;
    }
    // var [data] = await db.query(
    //   "UPDATE category SET name=:name, description=:description, status=:status, parent_id=:parent_id WHERE id = :id",
    //   {
    //     id: req.body.id,
    //     name: req.body.name, // null
    //     description: req.body.description,
    //     status: req.body.status,
    //     parent_id: req.body.parent_id,
    //   }
    // );
    res.json({
      // data: data,
      message: "Data update success!",
    });
  } catch (error) {
    logError("update.create", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM category WHERE id = :id", {
      id: req.body.id, // null
    });
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

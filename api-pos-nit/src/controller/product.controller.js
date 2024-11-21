const {
  db,
  isArray,
  isEmpty,
  logError,
  removeFile,
} = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    var { txt_search, category_id, brand, page, is_list_all } = req.query;
    const pageSize = 2; // fix
    page = Number(page); // 1,2,3,4 from client
    const offset = (page - 1) * pageSize; // find
    var sqlSelect = "SELECT  p.*, c.name AS category_name ";
    var sqlJoin =
      " FROM product p INNER JOIN category c ON p.category_id = c.id  ";
    var sqlWhere = " WHERE true ";
    if (txt_search) {
      sqlWhere += " AND (p.name LIKE :txt_search OR p.barcode = :barcode) ";
    }
    if (category_id) {
      sqlWhere += " AND p.category_id = :category_id";
    }
    if (brand) {
      sqlWhere += " AND p.brand = :brand";
    }
    var sqlLimit = " LIMIT " + pageSize + " OFFSET " + offset;
    if (is_list_all) {
      sqlLimit = "";
    }
    var sqlList = sqlSelect + sqlJoin + sqlWhere + sqlLimit;
    var sqlparam = {
      txt_search: "%" + txt_search + "%",
      barcode: txt_search,
      category_id,
      brand,
    };
    const [list] = await db.query(sqlList, sqlparam);

    var dataCount = 0;
    if (page == 1) {
      let sqlTotal = " SELECT COUNT(p.id) as total " + sqlJoin + sqlWhere;
      var [dataCount] = await db.query(sqlTotal, sqlparam);
      dataCount = dataCount[0].total;
    }

    res.json({
      list: list,
      total: dataCount,
    });
  } catch (error) {
    logError("product.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    // if (isExistBarcode(req.barcode)) {
    //   res.json({
    //     error: {
    //       barcode: "Barcode already exist.",
    //     },
    //   });
    //   return false;
    // }
    // console.log(req.files);
    // res.json({
    //   body: req.body,
    //   files: req.files,
    //   message: "Insert success!",
    // });

    var sql =
      " INSERT INTO product (category_id, barcode,name,brand,description,qty,price,discount,status,image,create_by ) " +
      " VALUES (:category_id, :barcode, :name, :brand, :description, :qty, :price, :discount, :status, :image, :create_by ) ";
    var [data] = await db.query(sql, {
      ...req.body,
      image: req.files?.upload_image[0]?.filename,
      create_by: req.auth?.name,
    });
    if (req.files && req.files?.upload_image_optional) {
      var paramImagePorduct = [];
      req.files?.upload_image_optional.map((item, index) => {
        paramImagePorduct.push([data?.insertId, item.filename]);
      });
      var sqlImageProduct =
        "INSERT INTO product_image (product_id,image) VALUES :data";
      var [dataImage] = await db.query(sqlImageProduct, {
        data: paramImagePorduct,
      });
    }
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
    if (req.files?.upload_image) {
      filename = req.files?.upload_image[0]?.filename;
    }
    /// image change
    if (
      req.body.image != "" &&
      req.body.image != null &&
      req.body.image != "null" &&
      req.files?.upload_image
    ) {
      removeFile(req.body.image); // remove old image
      filename = req.files?.upload_image[0]?.filename;
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

    // image opitonal
    if (req.files && req.files?.upload_image_optional) {
      var paramImagePorduct = [];
      req.files?.upload_image_optional.map((item, index) => {
        paramImagePorduct.push([req.body.id, item.filename]);
      });
      var sqlImageProduct =
        "INSERT INTO product_image (product_id,image) VALUES :data";
      var [dataImage] = await db.query(sqlImageProduct, {
        data: paramImagePorduct,
      });
    }

    //multiple image  ( case remove)
    if (req.body.image_optional && req.body.image_optional.length > 0) {
      // console.log(req.body.image_optional);
      if (typeof req.body.image_optional == "string") {
        req.body.image_optional = [req.body.image_optional];
      }
      req.body.image_optional?.map(async (item, index) => {
        // remove database
        let [data] = await db.query(
          "DELETE FROM product_image WHERE image = :image",
          { image: item }
        );
        // unlink from hard
        removeFile(item); // remove image
      });
      // image_optional = [
      //   // req.body.image_optional
      //   {
      //     isFound: false, // true(do nothing) | false(remove)
      //     name: "upload_image_optional-1730296826162-204342445",
      //     status: "removed",
      //     uid: "__AUTO__1730727364833_0__",
      //     url: "http://localhost:81/fullstack/image_pos/upload_image_optional-1730296826162-204342445",
      //   },
      // ];
    }

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

exports.productImage = async (req, res) => {
  try {
    var sql = "SELECT *  FROM product_image WHERE product_id=:product_id";
    var [list] = await db.query(sql, {
      product_id: req.params.product_id,
    });
    res.json({
      list,
    });
  } catch (error) {
    logError("remove.create", error, res);
  }
};

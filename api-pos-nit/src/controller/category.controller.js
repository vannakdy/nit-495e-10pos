const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [list] = await db.query("SELECT * FROM category");
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO category (Name,Description,Status,ParentId) VALUES (:Name,:Description,:Status,:ParentId) ";
    var [data] = await db.query(sql, {
      Name: req.body.Name, // null
      Description: req.body.Description,
      Status: req.body.Status,
      ParentId: req.body.ParentId,
    });
    res.json({
      data: data,
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

exports.update = (req, res) => {
  res.json({
    data: [3],
  });
};

exports.remove = (req, res) => {
  res.json({
    data: [4],
  });
};

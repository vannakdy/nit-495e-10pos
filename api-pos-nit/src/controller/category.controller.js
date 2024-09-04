const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [list] = await db.query("SELECT * FROM category ORDER BY Id DESC");
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
      message: "Insert success!",
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var [data] = await db.query(
      "UPDATE category SET Name=:Name, Description=:Description, Status=:Status, ParentId=:ParentId WHERE Id = :Id",
      {
        Id: req.body.Id,
        Name: req.body.Name, // null
        Description: req.body.Description,
        Status: req.body.Status,
        ParentId: req.body.ParentId,
      }
    );
    res.json({
      data: data,
      message: "Data update success!",
    });
  } catch (error) {
    logError("update.create", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM category WHERE Id = :Id", {
      Id: req.body.Id, // null
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("remove.create", error, res);
  }
};

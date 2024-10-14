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
    var sql =
      "INSERT INTO category (name,description,status,parent_id) VALUES (:name,:description,:status,:parent_id) ";
    var [data] = await db.query(sql, {
      name: req.body.name, // null
      description: req.body.description,
      status: req.body.status,
      parent_id: req.body.parent_id,
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
      "UPDATE category SET name=:name, description=:description, status=:status, parent_id=:parent_id WHERE id = :id",
      {
        id: req.body.id,
        name: req.body.name, // null
        description: req.body.description,
        status: req.body.status,
        parent_id: req.body.parent_id,
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

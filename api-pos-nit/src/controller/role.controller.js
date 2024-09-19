const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [list] = await db.query("SELECT * FROM role");
    res.json({
      i_know_you_are_id: req.current_id,
      list: list,
    });
  } catch (error) {
    logError("log.getList", error, res);
  }
};

exports.create = async (req, res) => {
  // validate
  try {
    var sql = "INSERT INTO role (name,code) VALUES (:name,:code) ";
    var [data] = await db.query(sql, {
      name: req.body.name, // null
      code: req.body.code,
    });
    res.json({
      data: data,
      message: "Insert success!",
    });
  } catch (error) {
    logError("role.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var [data] = await db.query(
      "UPDATE role SET name=:name, code=:code WHERE id = :id",
      {
        id: req.body.id,
        name: req.body.name,
        code: req.body.code, // null
      }
    );
    res.json({
      data: data,
      message: "Data update success!",
    });
  } catch (error) {
    logError("role.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM role WHERE id = :id", {
      id: req.body.id,
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("role.remove", error, res);
  }
};

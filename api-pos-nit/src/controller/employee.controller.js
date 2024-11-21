const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    var txtSearch = req.query.txtSearch;
    var sql = "SELECT * FROM employee ";
    if (!isEmpty(txtSearch)) {
      sql +=
        " WHERE firstname LIKE :txtSearch OR lastname LIKE :txtSearch OR tel LIKE :txtSearch OR email LIKE :txtSearch";
    }
    const [list] = await db.query(sql, {
      txtSearch: "%" + txtSearch + "%",
    });
    res.json({
      list: list,
    });
  } catch (error) {
    logError("employee.getList", error, res);
  }
};
// id,name,code,tel,email,address,website,note,create_by,create_at
// id,:name,:code,:tel,:email,:address,:website,:note,:create_by,:create_at
exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO employee (name,code,tel,email,address,website,note,create_by) VALUES (:name,:code,:tel,:email,:address,:website,:note,:create_by) ";
    var [data] = await db.query(sql, {
      ...req.body,
      create_by: req.auth?.name,
    });
    res.json({
      data: data,
      message: "Insert success!",
    });
  } catch (error) {
    logError("employee.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE  employee set name=:name, code=:code, tel=:tel, email=:email, address=:address, website=:website, note=:note WHERE id=:id ";
    var [data] = await db.query(sql, {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Update success!",
    });
  } catch (error) {
    logError("employee.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM employee WHERE id = :id", {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("employee.remove", error, res);
  }
};

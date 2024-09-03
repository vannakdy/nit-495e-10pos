const { logError, db } = require("../util/helper");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  try {
    // hash password
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10); // 123456, "314098spofaspdofjpo2rlsjlfasdf"
    let sql =
      "INSERT INTO " +
      " user ( role_id, name, username, password, is_active, create_by) VALUES " +
      " (:role_id,:name,:username,:password,:is_active,:create_by); ";
    let data = await db.query(sql, {
      role_id: req.body.role_id,
      name: req.body.name,
      username: req.body.username,
      password: password,
      is_active: req.body.is_active,
      create_by: req.body.create_by,
    });
    // "affectedRows": 1,
    // "insertId": 1,
    res.json({
      message: "Create new account success!",
      data: data,
    });
  } catch (error) {
    logError("auth.register", error, res);
  }
};
// a,b (123456)
// a : p1 => true
// b : p1 => true
exports.login = async (req, res) => {
  try {
    let { password, username } = req.body;
    let sql = "SELECT * FROM user WHERE username=:username ";
    let [data] = await db.query(sql, {
      username: username,
    });
    if (data.length == 0) {
      res.json({
        error: {
          username: "Username doesn't exist!",
        },
      });
    } else {
      let dbPass = data[0].password;
      let isCorrectPass = bcrypt.compareSync(password, dbPass); // true | false
      if (!isCorrectPass) {
        res.json({
          error: {
            password: "Password incorrect!",
          },
        });
      } else {
        res.json({
          message: "Login success",
          profile: data[0],
        });
      }
    }
  } catch (error) {
    logError("auth.login", error, res);
  }
};

exports.profile = (req, res) => {
  try {
  } catch (error) {
    logError("auth.register", error, res);
  }
};

const { logError, db } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");
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
        delete data[0].password;
        let obj = {
          profile: data[0],
          permision: ["view_all", "delete", "edit"],
        };
        res.json({
          message: "Login success",
          ...obj,
          access_token: await getAccessToken(obj),
        });
      }
    }
  } catch (error) {
    logError("auth.login", error, res);
  }
};

exports.profile = async (req, res) => {
  try {
    res.json({
      profile: req.profile,
    });
  } catch (error) {
    logError("auth.register", error, res);
  }
};

exports.validate_token = () => {
  // call in midleware in route (role route, user route, teacher route)
  return (req, res, next) => {
    var authorization = req.headers.authorization; // token from client
    var token_from_client = null;
    if (authorization != null && authorization != "") {
      token_from_client = authorization.split(" "); // authorization : "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
      token_from_client = token_from_client[1]; // get only access_token
    }
    if (token_from_client == null) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      jwt.verify(
        token_from_client,
        config.config.token.access_token_key,
        (error, result) => {
          if (error) {
            res.status(401).send({
              message: "Unauthorized",
              error: error,
            });
          } else {
            req.current_id = result.data.profile.id;
            req.profile = result.data.profile; // write user property
            req.permision = result.data.permision; // write user property
            next(); // continue controller
          }
        }
      );
    }
  };
};

const getAccessToken = async (paramData) => {
  const acess_token = await jwt.sign(
    { data: paramData },
    config.config.token.access_token_key,
    {
      expiresIn: "1d",
    }
  );
  return acess_token;
};

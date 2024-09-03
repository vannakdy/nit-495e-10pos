const { Config } = require("../config/config");
const db = require("../config/db");
const { logError, isEmptyOrNull, getPermissonMenuByRole, getConfig } = require("../config/service");
const bcript = require("bcrypt");
const jwt = require("jsonwebtoken");

const getList = async (req, res) => {
  try {
    var sql = "SELECT users.* , role.Name as RoleName FROM users  LEFT JOIN role ON (users.RoleId = role.Id);";
    const [list] = await db.query(sql);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("users.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [list] = await db.query("SELECT * FROM users WHERE Id = :Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("users.getOne", error, res);
  }
};

const create = async (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var RoleId = req.body.RoleId;
    var error = {};
    if (isEmptyOrNull(username)) {
      error.username = "username required!";
    }
    if (isEmptyOrNull(password)) {
      error.password = "password requered!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var hashPassword = bcript.hashSync(password, 10);
    var parameter = {
      username: username,
      password: hashPassword,
      RoleId: RoleId,
    };
    const [list] = await db.query("INSERT INTO users (Username,Password,RoleId) VALUES (:username,:password,:RoleId)", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("users.create", error, res);
  }
};

const update = async (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;
    var error = {};
    if (isEmptyOrNull(id)) {
      error.id = "id required!";
    }
    if (isEmptyOrNull(username)) {
      error.username = "username required!";
    }
    if (isEmptyOrNull(password)) {
      error.password = "password requered!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var hashPassword = bcript.hashSync(password, 10);
    var parameter = {
      id: id,
      password: hashPassword,
    };
    const [list] = await db.query("UPDATE  users SET  Password=:password WHERE Id=:id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("users.update", error, res);
  }
};

const remove = async (req, res) => {
  try {
    var Id = req.params.id;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Id: Id,
    };
    const [list] = await db.query("DELETE FROM users WHERE Id=:Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
};

const login = async (req, res) => {
  try {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var error = {};
    if (isEmptyOrNull(Username)) {
      error.Username = "Username required!";
    }
    if (isEmptyOrNull(Password)) {
      error.Password = "Password required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Username: Username,
      Password: Password,
    };
    const [data] = await db.query("SELECT role.Name as RoleName, users.* FROM users inner join role on (users.RoleId = role.Id)  WHERE users.Username=:Username", parameter);
    if (data.length > 0) {
      var user = data[0];
      var isCorrectPassword = bcript.compareSync(Password, user.Password); // true or false
      if (isCorrectPassword) {
        delete user.Password; // remove property Password from object user
        // generate JWT
        // var access_token = await jwt.sign({ data: user[0] }, ACCESS_TOKEN_KEY, { expiresIn: "60s" })
        var access_token = await jwt.sign({ data: user }, Config.ACCESS_TOKEN_KEY, { expiresIn: "60s" });
        var refresh_token = await jwt.sign({ data: user }, Config.REFRESH_TOKEN_KEY);
        res.json({
          message: "Login success",
          user: user,
          permison_menu: getPermissonMenuByRole(user.RoleName),
          access_token: access_token,
          refresh_token: refresh_token,
        });
        return;
      } else {
        res.json({
          error: {
            Password: "Password incorrect!",
          },
        });
        return;
      }
    } else {
      res.json({
        error: {
          Username: "Username does not exist!",
        },
      });
      return;
    }
    // data = [
    //     {
    //         Id : 1,
    //         Username :"amdine1",
    //         Username :"amdine1",
    //     }
    // ]
    res.json({
      list: data,
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
};

const userConfig = async (req, res) => {
  res.json({
    config: getConfig(),
  });
};

const refres_token = async (req, res) => {
  try {
    const { refres_token } = req.body;
    jwt.verify(refres_token, Config.REFRESH_TOKEN_KEY, async (error, result) => {
      if (error) {
        res.status(401).send({
          message: "Unauthorized",
          error: error,
        });
      } else {
        // re new access_token and refresh_token
        var user_from_token = result.data;
        const [data] = await db.query("SELECT * FROM users  WHERE Id=:Id", { Id: user_from_token.Id });
        var user = data[0];
        delete user.Password;
        var access_token = await jwt.sign({ data: user }, Config.ACCESS_TOKEN_KEY, { expiresIn: "60s" });
        var refresh_token = await jwt.sign({ data: user }, Config.REFRESH_TOKEN_KEY);
        res.json({
          message: "refresh token success",
          user: user,
          access_token: access_token,
          refresh_token: refresh_token,
        });
      }
    });
  } catch (error) {
    logError("user.refresh_token", error, res);
  }
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
  login,
  refres_token,
  userConfig,
};

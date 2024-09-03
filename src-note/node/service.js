const fs = require("fs/promises");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { Config } = require("./config");
const multer = require("multer");
const { config } = require("../share/data");
// npm install moment
// requeired create folder logs in root projet
// node-api/logs
const logError = async (controller, message, res) => {
  try {
    // Append the log message to the file (create the file if it doesn't exist)
    const timestamp = moment().format("DD/MM/YYYY HH:mm:ss"); // Use 'moment' for formatted timestamp
    const path = "./logs/" + controller + ".txt";
    const logMessage = "[" + timestamp + "] " + message + "\n\n";
    await fs.appendFile(path, logMessage);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
  res.status(500).send("Internal Server Error!");
};

const isEmptyOrNull = (value) => {
  if (value === "" || value === null || value === "null" || value === undefined || value === "undefined") {
    return true;
  }
  return false;
};

const validate_token = () => {
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
      jwt.verify(token_from_client, Config.ACCESS_TOKEN_KEY, (error, result) => {
        if (error) {
          res.status(401).send({
            message: "Unauthorized",
            error: error,
          });
        } else {
          req.user = result.data; // write user property
          req.user_id = result.data.Id; // write user property
          req.user_name = result.data.Username; // write user property
          next(); // continue controller
        }
      });
    }
  };
};

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, Config.IMAGE_PATH);
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 3, // max 3MB
  },
  fileFilter: function (req, file, callback) {
    if (file.mimetype != "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg") {
      // not allow
      callback(null, false);
    } else {
      callback(null, true);
    }
  },
});

const removeFile = async (fileName) => {
  try {
    await fs.unlink(Config.IMAGE_PATH + fileName);
    return "File deleted successfully";
  } catch (err) {
    console.error("Error deleting file:", err);
    throw err;
  }
};

const getPermissonMenuByRole = (RoleName) => {
  var data = {
    Admin: [
      {
        route: "/admin",
      },
      {
        route: "/admin/enroll",
      },
      {
        route: "/admin/classroom",
      },
      {
        route: "/admin/teacher",
      },
      {
        route: "/admin/student",
      },
      {
        route: "/admin/course",
      },
      {
        route: "/admin/course_category",
      },
      {
        route: "/admin/course_outline",
      },
      {
        route: "/admin/course_feed",
      },
      {
        route: "/admin/user",
      },
      {
        route: "/admin/role",
      },
    ],
    Teacher: [
      {
        route: "/admin",
      },
      {
        route: "/admin/student",
      },
      {
        route: "/Course",
      },
      {
        route: "/admin/course",
      },
      {
        route: "/admin/course_category",
      },
    ],
    Student: [],
  };
  return data[RoleName];
};

const getConfig = () => {
  return config;
};

module.exports = {
  logError,
  isEmptyOrNull,
  validate_token,
  upload,
  removeFile,
  getPermissonMenuByRole,
  getConfig,
};

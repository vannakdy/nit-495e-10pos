const { validate_token } = require("../controller/auth.controller");
const { getList } = require("../controller/config.controller");
module.exports = (app) => {
  app.get("/api/config", validate_token(), getList);
};

const {
  getList,
  register,
  login,
  profile,
  validate_token,
} = require("../controller/auth.controller");

module.exports = (app) => {
  app.get("/api/auth/get-list", getList);
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", validate_token(), profile);
};

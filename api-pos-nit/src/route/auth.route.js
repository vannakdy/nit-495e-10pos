const {
  getList,
  register,
  login,
  profile,
  validate_token,
} = require("../controller/auth.controller");

module.exports = (app) => {
  app.get("/api/auth/get-list", validate_token(), getList);
  app.post("/api/auth/register", validate_token(), register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", validate_token(), profile);
};

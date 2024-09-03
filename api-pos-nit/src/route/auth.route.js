const { register, login, profile } = require("../controller/auth.controller");

module.exports = (app) => {
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", profile);
};

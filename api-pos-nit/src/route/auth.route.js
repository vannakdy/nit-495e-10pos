const {
  create,
  getList,
  update,
  remove,
} = require("../controller/auth.controller");

module.exports = (app) => {
  app.get("/api/auth", getList);
  app.post("/api/auth", create);
  app.put("/api/auth", update);
  app.delete("/api/auth", remove);
};

const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/supplier.controller");
module.exports = (app) => {
  app.get("/api/supplier", validate_token(), getList);
  app.post("/api/supplier", validate_token(), create);
  app.put("/api/supplier", validate_token(), update);
  app.delete("/api/supplier", validate_token(), remove);
};

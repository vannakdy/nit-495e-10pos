const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/order.controller");
module.exports = (app) => {
  app.get("/api/order", validate_token(), getList);
  app.post("/api/order", validate_token(), create);
  app.put("/api/order", validate_token(), update);
  app.delete("/api/order", validate_token(), remove);
};

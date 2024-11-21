const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/customer.controller");
module.exports = (app) => {
  app.get("/api/customer", validate_token(), getList);
  app.post("/api/customer", validate_token(), create);
  app.put("/api/customer", validate_token(), update);
  app.delete("/api/customer", validate_token(), remove);
};

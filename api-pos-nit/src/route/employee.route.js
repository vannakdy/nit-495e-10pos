const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/employee.controller");
module.exports = (app) => {
  app.get("/api/employee", validate_token(), getList);
  app.post("/api/employee", validate_token(), create);
  app.put("/api/employee", validate_token(), update);
  app.delete("/api/employee", validate_token(), remove);
};

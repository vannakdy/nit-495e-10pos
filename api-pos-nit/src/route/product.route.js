const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/product.controller");
const { uploadFile } = require("../util/helper");

module.exports = (app) => {
  app.post(
    "/api/product",
    validate_token(),
    uploadFile.single("upload_image"),
    create
  );
  app.get("/api/product", validate_token(), getList);
  app.put("/api/product", validate_token(), update);
  app.delete("/api/product", validate_token(), remove);
};

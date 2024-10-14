const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [category] = await db.query(
      "select id,name,description from category"
    );
    const [role] = await db.query("select id,name,code from role");
    const [supplier] = await db.query("select id,name,code from supplier");
    const purchase_status = [
      {
        lebel: "Pending",
        value: "Pending",
      },
      {
        lebel: "Approved",
        value: "Approved",
      },
      {
        lebel: "Shiped",
        value: "Shiped",
      },
      {
        lebel: "Received",
        value: "Received",
      },
      {
        lebel: "Issues",
        value: "Issues",
      },
    ];
    res.json({
      category,
      role,
      supplier,
      purchase_status,
    });
  } catch (error) {
    logError("config.getList", error, res);
  }
};

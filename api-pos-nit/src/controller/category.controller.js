const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [list] = await db.query("SELECT * FROMs category");
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    const [list] = await db.query("Insert into");
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

exports.update = (req, res) => {
  res.json({
    data: [3],
  });
};

exports.remove = (req, res) => {
  res.json({
    data: [4],
  });
};

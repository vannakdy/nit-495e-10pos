exports.getList = (req, res) => {
  res.json({
    list: [1],
  });
};

exports.create = (req, res) => {
  res.json({
    data: [2],
  });
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

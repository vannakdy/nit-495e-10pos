const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const list = [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
  ];
  res.json({
    list,
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});

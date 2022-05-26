const express = require("express");

const app = express();

app.get("/", (req, res) => {
  const resp = JSON.stringify(
    {
      cors: "ok",
      headers: req.headers,
    },
    null,
    4
  );
  console.log(resp);
  // res.setHeader("Access-Control-Allow-Origin", "http://example.com");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(resp);
});

app.post("/", (req, res) => {
  const resp = JSON.stringify(
    {
      cors: "ok",
      headers: req.headers,
    },
    null,
    4
  );
  console.log(resp);
  // res.setHeader("Access-Control-Allow-Origin", "https://example.com");
  // res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(resp);
});

app.listen(8080, () => {
  console.log("backend started on http://localhost:8080");
});

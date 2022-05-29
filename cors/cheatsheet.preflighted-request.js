const express = require("express");

const app = express();

app.options("/doc", (req, res) => {
  const resp = JSON.stringify(
    {
      options: "ok",
      headers: req.headers,
    },
    null,
    2
  );
  console.log(resp);
  res.setHeader("Access-Control-Allow-Origin", "https://example.com");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.send();
});
// const cors = require("cors");
// app.options("/doc", cors()); // default cors settings are open to all

app.post("/doc", (req, res) => {
  const resp = JSON.stringify(
    {
      cors: "ok",
      headers: req.headers,
    },
    null,
    2
  );
  console.log(resp);
  res.setHeader("Access-Control-Allow-Origin", "https://example.com");
  res.send(resp);
});

app.listen(8080, () => {
  console.log("Listening on port http://localhost:8080");
});

const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();
app.use(cookieParser()); // cookies no encrypted

const randBetween = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};

// homepage
app.get("/", (req, res) => {
  // simple cookie
  res.cookie("random", `${randBetween(1, 100)}`);

  // HttpOnly cookie
  res.cookie("HttpOnly-random", `${randBetween(1, 100)}`, {
    httpOnly: true,
  });

  // Secure cookie (⚠️ except on localhost)
  res.cookie("secure-random", `${randBetween(1, 100)}`, {
    secure: true,
  });

  res.sendFile(__dirname + "/index.html");
});

app.get("/check-cookie", (req, res) => {
  const cookies = {
    cookies: req.cookies,
  };
  console.log(JSON.stringify(cookies, null, 2));
  res.send(cookies);
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000");
});

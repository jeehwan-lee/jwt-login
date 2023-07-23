const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "signup",
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE userId = ? AND password =? ";
  db.query(sql, [req.body.userId, req.body.password], (err, data) => {
    if (err) return res.json({ Message: "Server Side Error" });
    if (data.length > 0) {
      const name = data[0].name;
      const token = jwt.sign({ name }, "secret-key", { expiresIn: "1d" });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Message: "NO Records existed" });
    }
  });
});

app.listen(8081, () => {
  console.log("Server Running");
});

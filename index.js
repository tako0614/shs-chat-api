const express = require("express");
const app = express();
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/test4";
mongoose.connect(url).then(() => {
  console.log("mongo DB 接続");
}).catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getMessages", (req, res) => {
    const userName = req.query.userName;
    const message = req.query.message;
    const password = req.query.password;
    if(userName == "userName" && password == "password"){

    } else {
        res.send({message: "ユーザー名またはパスワードが違います"})
    }
});
app.listen(80, () => {
  console.log("Server listening on port 3000");
});

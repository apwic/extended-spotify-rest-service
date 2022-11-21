const express = require("express");
const cors = require("cors");
const { json } = require("sequelize");

const app = express();

const db = require("./app/models");
const User = db.user;

db.sequelize.sync({force: true}).then(() => {
  console.log("Sync DB");
  populate();
});

function populate(){
  User.create({
    username: "admin",
    email : "admin@gmail.com",
    password: "admin",
    name: "admin",
    isAdmin: true
  });
};

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// content-type application/json
app.use(express.json());

// content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// set port, use 8080 if not exist
const PORT = process.env.PORT || 8080;

// base route
app.get("/", (req, res) => {
  res.json({message: "Server started at localhost:" + PORT});
});

// listen for request
app.listen(PORT, () => {
  console.log("Server running at at localhost:" + PORT);
});
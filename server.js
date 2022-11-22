const express = require("express");
const cors = require("cors");
const { json } = require("sequelize");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");

const app = express();

const db = require("./app/models");
const User = db.user;

db.sequelize.sync();
dotenv.config();

var corsOptions = {
  origin: "http://localhost:" + process.env.CORS_ORIGIN_PORT
};

app.use(cors(corsOptions));

// content-type application/json
app.use(express.json());

// content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// set cookies
app.use(
  cookieSession({
    name: "sepotipayi-premium",
    secret: process.env.SECRET_KEY,
    httpOnly: true
  })
)

// set routes
require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/song.routes.js")(app);

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
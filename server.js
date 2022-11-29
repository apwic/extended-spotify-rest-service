const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { json } = require("sequelize");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

global.__basedir = __dirname;
dotenv.config();

const app = express();

const db = require("./app/models");

// sync database
db.sequelize.sync();

var corsOptions = {
  credentials: true,
  origin: ["http://localhost", "http://localhost:3000"]
};

app.use(morgan('combined'));
app.use(cors(corsOptions));

// content-type application/json
app.use(bodyParser.json());

// content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set cookies
app.use(
  cookieSession({
    name: "sepotipayi-premium",
    secret: process.env.JWT_SECRET_KEY,
    httpOnly: true
  })
)

// set routes
require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/song.routes.js")(app);
app.use(express.static(path.join(__basedir, '/public')));

// set port, use 8080 if not exist
const PORT = process.env.PORT || 8080;

// base route
app.get("/", (req, res) => {
  res.json({message: "Server started at localhost:" + PORT});
});

// listen for request
app.listen(PORT, () => {
  console.log("Server running at localhost:" + PORT);
});
const db = require("../models");
const config = require("../config/auth.config.js");
const User = db.user;

const Op = db.sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      name: req.body.name,
      isAdmin: false
    });

    return res.status(200).send({
      message: "SignUp successfully"
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      })
    }
  
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Wrong password"
      })
    }

    const token = jwt.sign(
      {user_id : user.user_id}, 
      config.secret,
      {expiresIn: 1800}
    );

    req.session.token = token;

    return res.status(200).send({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      password: user.password,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
};

exports.signOut = async (req, res) => {
  try {
    req.session = null;

    return res.status(200).send({
      message: "SignOut successfully"
    });
  } catch (err) {
    this.next(err);
  }
};
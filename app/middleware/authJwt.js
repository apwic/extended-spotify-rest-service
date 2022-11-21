const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "Token not provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauhtorized token!"
      });
    }
    req.user_id = decoded.user_id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const admin = await User.findOne({
      attributes: ['isAdmin'],
      where: {
        user_id: req.user_id
      }
    });

    if (admin){
      next();
      return;
    }

    res.status(403).send({
      message : "Not admin!"
    });
    return;
  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};

module.exports = authJwt;
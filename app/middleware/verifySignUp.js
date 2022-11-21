const db = require("../models");
const User = db.user;

checkDuplicate = async (req, res, next) => {
  // check for existing username
  try {
    let user = await User.findOne({
      where : {
        username: req.body.username
      }
    });
    
    if (user) {
      return res.status(400).send({
        message: "Username already exist!"
      });
    }

    // check for existing email
    user = await User.findOne({
      where : {
        email: req.body.email
      }
    });
      
    if (user) {
      return res.status(400).send({
        message: "Email already exist!"
      });
    }
    next();
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
};

const verifySignUp = {
  checkDuplicate
}

module.exports = verifySignUp;
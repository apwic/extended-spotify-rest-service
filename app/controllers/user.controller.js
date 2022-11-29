const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public content.");
}

exports.userAccess = (req, res) => {
  res.status(200).send("User content.");
}

exports.adminAccess = (req, res) => {
  res.status(200).send("Admin content.");
}

exports.getUsers = async(req, res) => {
  try {
    const idParams = req.query.id;

    if (!idParams) {
      const users = await User.findAll({
        where: {
          isAdmin: false,
        }
      });
      let userList = [];

      if (!users) {
        return res.status(404).send({
          message: "Users not found"
        });
      }

      for (let i=0; i < users.length; i++) {
        userList.push(users[i]);
      }
      
      return res.status(200).send({
        users: userList
      });
    } else {
      const user = await User.findOne({
        where: {
          user_id : req.query.id
        }
      });

      if (!user) {
        return res.status(404).send({
          message: "User not found"
        });
      }

      return res.status(200).send({
        user_id : user.user_id,
        username : user.username,
        email : user.email,
        name : user.name,
        isAdmin : user.isAdmin
      })
    }

  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
}
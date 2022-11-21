module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull : false
    },
    email : {
      type: Sequelize.STRING,
      allowNull: false
    },
    password : {
      type: Sequelize.STRING,
      allowNull: false
    },
    name : {
      type: Sequelize.STRING,
      allowNull: false
    }, 
    isAdmin :  {
      type: Sequelize.BOOLEAN,
      allowNull : false
    }
  });

  return User;
};
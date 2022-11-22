module.exports = (sequelize, Sequelize) => {
  const Song = sequelize.define("song", {
    song_id : {
      type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    judul : {
      type: Sequelize.STRING,
      allowNull: false
    },
    audio_path : {
      type: Sequelize.STRING,
      allowNull: false
    },
    penyanyi_id : {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model : 'users',
        key : 'user_id'
      }
    }
  });

  return Song;
};
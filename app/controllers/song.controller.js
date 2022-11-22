const { user } = require("../models");
const db = require("../models");
const Song = db.song;

exports.getSongs = async(req, res) => {
  try {
    const idParams = req.query.id;

    if (!idParams) {
      const songs = await Song.findAll();
      let songList = [];
  
      if (!songs) {
        return res.status(404).send({
          message: "Songs not found"
        });
      }
  
      for (let i=0; i < songs.length; i++) {
        songList.push(songs[i]);
      }
      
      return res.status(200).send({
        songs: songList
      });
    } else {
      const song = await Song.findOne({
        where: {
          song_id : req.query.id
        }
      });
    
      if (!song) {
        return res.status(404).send({
          message: "Song not found"
        });
      }
  
      return res.status(200).send({
        song_id : song.song_id,
        judul : song.judul,
        penyanyi_id : song.penyanyi_id,
        audio_path : song.audio_path
      });
    }

  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
};

exports.getSongsByPenyanyiID = async(req, res) => {
  try {
    const songs = await Song.findAll({
      where: {
        penyanyi_id: req.user_id
      }
    })

    if (!songs) {
      return res.status(404).send({
        message: "Songs not found"
      });
    }

    let songList = [];

    for (let i=0; i < songs.length; i++) {
      songList.push(songs[i]);
    }
    
    return res.status(200).send({
      songs: songList
    });
  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
}


exports.createSong = async(req, res) => {
  try {
    const song = await Song.create({
      judul: req.body.judul,
      audio_path: req.body.audio_path,
      penyanyi_id: req.user_id
    })

    return res.status(200).send({
      message: "Song created succesfully"
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
};

exports.deleteSong = async(req, res)  => {
  try {
    const song = await Song.destroy({
      where : {
        song_id : req.query.id
      }
    });

    return res.status(200).send({
      message: "Song deleted succesfully"
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
};

exports.updateSong = async(req, res) => {
  try {
    const song = await Song.update(
      {
        judul: req.body.judul,
        audio_path: req.body.audio_path
      },
      { where: {
        song_id : req.query.id
      }}
    );

    return res.status(200).send({
      message: "Song updated succesfully"
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
};






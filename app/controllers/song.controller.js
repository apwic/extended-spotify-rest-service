const uploadFile = require("../middleware/file");
const db = require("../models");
const soap = require("../soap.common")
const { parseStringPromise } = require("xml2js");
const { subsBySubsIdParser } = require("../utils/soapParser");
const fs = require("fs");
const path = require("path");

const Song = db.song;
const User = db.user;

exports.getSongs = async(req, res) => {
  try {
    const idParams = req.query.id;
    const penyanyiIdParams = req.query.penyanyi_id;

    if (idParams) {
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
    } else if (penyanyiIdParams) {
      const songs = await Song.findAll({
        where: {
          penyanyi_id: penyanyiIdParams
        }
      })

      const user = await User.findOne({
        where : {
          user_id: penyanyiIdParams,
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
        songs: songList,
        penyanyi: user.name,
      });
    } else {
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
    }

  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
};

exports.getSongsByUserToken = async(req, res) => {
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

exports.getSongsBySubs = async(req, res) => {
  try {
    const envelope = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                          <Body>
                              <getSubscriptionBySubsId xmlns="http://controllers/">
                                  <arg0 xmlns="">${req.query.subscriberId}</arg0>
                              </getSubscriptionBySubsId>
                          </Body>
                      </Envelope>`;

    const subList = await soap.post("/subscription", envelope)
                              .then((response) => {
                                return parseStringPromise(response.data);
                              })
                              .then((result) => {
                                const subs = subsBySubsIdParser(result);
                                return subs;
                              });

    if (subList.length === 0) {
      return res.status(404).send({
        message: "User not subscribed to any singer"
      })
    }
    
    let songList = [];

    for (let i=0; i < subList.length; i++){
      const songs = await Song.findAll({
        where: {
          penyanyi_id: subList[i].creatorId
        }
      });

      if (songs){
        for (let j=0; j < songs.length; j++){
          songList.push({
            "song_id": songs[j].song_id,
            "judul": songs[j].judul,
            "audio_path": songs[j].audio_path,
            "penyanyi_id": songs[j].penyanyi_id,
            "createdAt": songs[j].createdAt,
            "updatedAt": songs[j].updatedAt,
            "penyanyi" : subList[i].creatorName
          });
          console.log(songList);
        }
      }
    }

    if (songList.length === 0) {
      return res.status(404).send({
        message: "Songs not found"
      })
    }

    return res.status(200).send({
      songs: songList,
    });

  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
}

exports.createSong = async(req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return (res.status(400).send({message: "File not included in request!"}));
    }

    Song.create({
      judul: req.body.judul,
      audio_path: `http://localhost:${process.env.PORT || "8080"}/uploads/${req.file.filename}`,
      penyanyi_id: req.user_id
    });

    return res.status(200).send({
      message: "Song created succesfully"
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 64MB!",
      });
    }

    return res.status(500).send({
      message: err.message
    });
  }
};

exports.deleteSong = async(req, res)  => {
  try {
    let song = await Song.findOne({
      attributes: ['audio_path'],
      where: {
        song_id: req.query.id,
      }
    });

    if (!song) {
      return res.status(404).send({
        message: "Songs not found"
      });
    }

    const audio_path = song.audio_path;
    const fileName = path.parse(audio_path).name + path.parse(audio_path).ext;
    const dirPath = __basedir + "/public/uploads/" + fileName;

    fs.unlink(dirPath, (err) => {
      if (err) {
        return res.status(500).send({
          message: "Could not delete file. " + err,
        });
      }

      song = Song.destroy({
        where : {
          song_id : req.query.id
        }
      });
  
      return res.status(200).send({
        message: "Song deleted succesfully"
      });
    });

  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
};

exports.updateSong = async(req, res) => {
  try {
    await uploadFile(req, res);

    const song = await Song.findOne({
      where: {
        song_id: req.body.id,
      }
    });

    if (!song) {
      return res.status(404).send({
        message: "Songs not found"
      });
    }

    const old_audio_path = song.audio_path;
    const fileName = path.parse(old_audio_path).name + path.parse(old_audio_path).ext;
    const dirPath = __basedir + "/public/uploads/" + fileName;
    
    if (req.file == undefined) {
      if (req.body.judul == undefined) {
        return (res.status(400).send({message: "File not included in request!"}));
      } else {
        Song.update({
            judul: req.body.judul,
          },
          { where: {
            song_id : req.body.id
          }}
        );

        return res.status(200).send({
          message: "Song updated succesfully"
        });
      }
    } else {
      if (req.body.judul == undefined) {
        Song.update({
            audio_path: `http://localhost:${process.env.PORT || "8080"}/uploads/${req.file.filename}`,
          },
          { where: {
            song_id : req.body.id
          }}
        );
      } else {
        Song.update({
            judul: req.body.judul,
            audio_path: `http://localhost:${process.env.PORT || "8080"}/uploads/${req.file.filename}`,
          },
          { where: {
            song_id : req.body.id
          }}
        );
      }
      
      fs.unlink(dirPath, (err) => {
        if (err) {
          return res.status(500).send({
            message: "Could not delete file. " + err,
          });
        }
    
        return res.status(200).send({
          message: "Song updated succesfully"
        });
      });
    }

  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
};
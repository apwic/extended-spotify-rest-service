const { authJwt } = require("../middleware");
const controller = require("../controllers/song.controller.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/songs", controller.getSongs);

  app.get("/songs/user",
    [authJwt.verifyToken],
    controller.getSongsByUserToken
  );

  app.post("/songs",
    [authJwt.verifyToken],
    controller.createSong
  );

  app.delete("/songs",
    [authJwt.verifyToken],
    controller.deleteSong
  );

  app.patch("/songs",
    [authJwt.verifyToken],
    controller.updateSong
  );
};
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
    [authJwt.verifyToken, authJwt.isUser],
    controller.getSongsByUserToken
  );

  app.get("/songs/subscription", controller.getSongsBySubs);

  app.post("/songs",
    [authJwt.verifyToken, authJwt.isUser],
    controller.createSong
  );

  app.delete("/songs",
    [authJwt.verifyToken, authJwt.isUser],
    controller.deleteSong
  );

  app.patch("/songs",
    [authJwt.verifyToken, authJwt.isUser],
    controller.updateSong
  );
};
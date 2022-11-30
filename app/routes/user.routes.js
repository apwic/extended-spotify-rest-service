const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/test/all", controller.allAccess);

  app.get("/test/user",
    [authJwt.verifyToken, authJwt.isUser],
    controller.userAccess
  );

  app.get("/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminAccess
  );

  app.get("/users", controller.getUsers);
};
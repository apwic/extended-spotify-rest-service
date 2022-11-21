const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/auth/signup",
    [verifySignUp.checkDuplicate],
    controller.signUp
  );

  app.post("/auth/signin", controller.signIn);

  app.post("/auth/signout", controller.signOut);
};
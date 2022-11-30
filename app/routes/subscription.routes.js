const controller = require("../controllers/subscription.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/subscription",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSubscriptionList
  );

  app.patch("/subscription",
    [authJwt.verifyToken, authJwt.isUser],
    controller.updateSubscription
  );
};
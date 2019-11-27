const express = require("express");
const { topicsRouter } = require("./topicsRouter");
const { usersRouter } = require("./usersRouter");
const { articlesRouter } = require("./articlesRouter");
const { errorHandler405 } = require("../errors");
apiRouter = express.Router();

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({ message: "Welcome to Vital News" });
  })
  .all(errorHandler405);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = { apiRouter };

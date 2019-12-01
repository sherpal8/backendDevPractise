const express = require("express");
const { topicsRouter } = require("./topicsRouter");
const { usersRouter } = require("./usersRouter");
const { articlesRouter } = require("./articlesRouter");
const { commentsRouter } = require("./commentsRouter");
const { errorHandler405 } = require("../errors");
const _ = require("../controllers");
apiRouter = express.Router();

apiRouter
  .route("/")
  .get(_.getEndpoints)
  .all(errorHandler405);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = { apiRouter };

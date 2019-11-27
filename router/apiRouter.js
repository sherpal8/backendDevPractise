const express = require("express");
const { topicsRouter } = require("./topicsRouter");
const { usersRouter } = require("./usersRouter");
const { articlesRouter } = require("./articlesRouter");
apiRouter = express.Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "Welcome to Vital News" });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = { apiRouter };

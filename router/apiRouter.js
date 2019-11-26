const express = require("express");
const { topicsRouter } = require("./topicsRouter");
apiRouter = express.Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "Welcome to Vital News" });
});

apiRouter.use("/topics", topicsRouter);

module.exports = { apiRouter };

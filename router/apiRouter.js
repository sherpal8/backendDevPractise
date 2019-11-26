const express = require("express");

apiRouter = express.Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "Welcome to Vital News" });
});

module.exports = apiRouter;

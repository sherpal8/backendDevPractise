const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers");
const { errorHandler405 } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUser)
  .all(errorHandler405);

module.exports = { usersRouter };

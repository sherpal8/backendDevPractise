const express = require("express");
const usersRouter = express.Router();
const _ = require("../controllers");
const e = require("../errors");

usersRouter
  .route("/:username")
  .get(_.getUser)
  .all(e.errorHandler405);

module.exports = { usersRouter };

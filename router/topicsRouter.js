const express = require("express");
const topicsRouter = express.Router();
const _ = require("../controllers");
const e = require("../errors");

topicsRouter
  .route("/")
  .get(_.getTopics)
  .all(e.errorHandler405);

module.exports = { topicsRouter };

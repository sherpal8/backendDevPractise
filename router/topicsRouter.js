const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../controllers");
const { errorHandler405 } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(errorHandler405);

module.exports = { topicsRouter };

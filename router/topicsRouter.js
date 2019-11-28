const express = require("express");
const topicsRouter = express.Router();
const _ = require("../controllers");
const e = require("../errors");

console.log(typeof _.getTopics);
topicsRouter
  .route("/")
  .get(_.getTopics)
  .all(e.errorHandler405);

module.exports = { topicsRouter };

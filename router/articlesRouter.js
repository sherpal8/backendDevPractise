const express = require("express");
const articlesRouter = express.Router();
const { getArticle } = require("../controllers");
const { errorHandler405 } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .all(errorHandler405);

module.exports = { articlesRouter };

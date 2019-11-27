const express = require("express");
const articlesRouter = express.Router();
const { getArticle, patchArticle } = require("../controllers");
const { errorHandler405 } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(errorHandler405);

module.exports = { articlesRouter };

const express = require("express");
const articlesRouter = express.Router();
const _ = require("../controllers");
const e = require("../errors");

articlesRouter
  .route("/:article_id/comments")
  .post(_.postComment)
  .get(_.getArticleComments)
  .all(e.errorHandler405);

articlesRouter
  .route("/:article_id")
  .get(_.getArticle)
  .patch(_.patchArticle)
  .all(e.errorHandler405);

module.exports = { articlesRouter };

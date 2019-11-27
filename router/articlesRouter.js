const express = require("express");
const articlesRouter = express.Router();
const { getArticle } = require("../controllers");

articlesRouter.get("/:article_id", getArticle);

module.exports = { articlesRouter };

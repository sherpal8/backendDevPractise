const { getTopics } = require("./getTopics");
const { getUser } = require("./getUser");
const { getArticle } = require("./getArticle");
const { patchArticle } = require("./patchArticle");
const { postComment } = require("./postComment");
const { getArticleComments } = require("./getArticleComments");
const { getManyArticles } = require("./getManyArticles");

module.exports = {
  getTopics,
  getUser,
  getArticle,
  patchArticle,
  postComment,
  getArticleComments,
  getManyArticles
};

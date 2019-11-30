const { fetchTopics } = require("./fetchTopics");
const { fetchUser } = require("./fetchUser");
const { fetchArticle } = require("./fetchArticle");
const { updateArticle } = require("./updateArticle");
const { sendComment } = require("./sendComment.js");
const { fetchArticleComments } = require("./fetchArticleComments");
const { updateComment } = require("./updateComment");
const { removeComment } = require("./removeComment");

module.exports = {
  fetchTopics,
  fetchUser,
  fetchArticle,
  updateArticle,
  sendComment,
  fetchArticleComments,
  updateComment,
  removeComment
};

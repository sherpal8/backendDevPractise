const { fetchTopics } = require("./fetchTopics");
const { fetchUser } = require("./fetchUser");
const { fetchArticle } = require("./fetchArticle");
const { updateArticle } = require("./updateArticle");
const { sendComment } = require("./sendComment.js");

module.exports = {
  fetchTopics,
  fetchUser,
  fetchArticle,
  updateArticle,
  sendComment
};

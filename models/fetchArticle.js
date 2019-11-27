const { connection } = require("../connection");
exports.fetchArticle = function(article_id) {
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .join("comments", "comments.article_id", "articles.article_id")
    .count({ comment_count: "comments.article_id" })
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id);
};

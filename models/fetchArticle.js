const { connection } = require("../connection");
exports.fetchArticle = function(
  article_id = null,
  sort_by,
  order_by,
  author,
  topic
) {
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .count({ comment_count: "comments.article_id" })
    .groupBy("articles.article_id")
    .modify(function(query) {
      if (article_id && article_id !== null) {
        query.select("articles.body").where("articles.article_id", article_id);
      }
      if (sort_by || (order_by && article_id === null)) {
        query.orderBy(`articles.${sort_by}`, order_by);
      }
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    });
};

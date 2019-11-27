const { connection } = require("../connection");

exports.fetchArticle = function(article_id) {
  let finalObj = {};
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
    .where(article_id)
    .then(function([data]) {
      finalObj = data;
      return connection("comments")
        .count({ comment_count: "article_id" })
        .where(article_id);
    })
    .then(function([{ comment_count }]) {
      finalObj.comment_count = comment_count;
      return finalObj;
    });
};

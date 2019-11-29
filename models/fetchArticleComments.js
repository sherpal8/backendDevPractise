const { connection } = require("../connection");

exports.fetchArticleComments = (article_id, sort_by, order_by) => {
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where(article_id)
    .orderBy(sort_by, order_by)
    .then(function(data) {
      return data;
    });
};

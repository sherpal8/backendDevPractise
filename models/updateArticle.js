const { connection } = require("../connection");

exports.updateArticle = (article_id, inc_votes) => {
  return connection("articles")
    .increment("votes", inc_votes)
    .where({ article_id })
    .then(function() {
      return connection("articles")
        .select("*")
        .where({ article_id });
    });
};

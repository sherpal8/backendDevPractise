const { fetchArticle } = require("../models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  // if article_id not a number
  if (/\D+/.test(article_id)) {
    return res.status(400).send({ message: "Bad request" });
  }

  return fetchArticle(article_id)
    .then(function([article]) {
      if (!article) {
        // if article_id does not exist in db
        return res.status(422).send({ message: "Unprocessable entity" });
      }
      return res.status(200).send({ article });
    })
    .catch(function(err) {
      next(err);
    });
};

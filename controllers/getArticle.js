const { fetchArticle } = require("../models");

exports.getArticle = (req, res, next) => {
  const article_id = req.params;
  return fetchArticle(article_id).then(function(article) {
    res.status(200).send({ article });
  });
};

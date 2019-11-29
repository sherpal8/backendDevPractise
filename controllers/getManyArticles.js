const { fetchArticle } = require("../models");

exports.getManyArticles = (req, res, next) => {
  return fetchArticle()
    .then(function(articles) {
      return res.status(200).send({ articles });
    })
    .catch(function(err) {
      next(err);
    });
};

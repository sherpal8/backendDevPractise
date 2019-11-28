const { fetchArticleComments } = require("../models");

exports.getArticleComments = (req, res, next) => {
  return fetchArticleComments().then(function(comments) {
    return res.status(200).send({ comments });
  });
};

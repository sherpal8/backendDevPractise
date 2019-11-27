const { updateArticle } = require("../models");

exports.patchArticle = (req, res, next) => {
  return updateArticle()
    .then(function(value) {
      return res.status(200).send(value);
    })
    .catch(function(err) {
      next(err);
    });
};

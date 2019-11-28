const { updateArticle } = require("../models");

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  let testVal = inc_votes < 0 ? -inc_votes : inc_votes;
  if (/\D+/.test(testVal)) {
    return res.status(400).send({ message: "Bad request" });
  }

  return updateArticle(article_id, inc_votes)
    .then(function([article]) {
      return res.status(200).send({ article });
    })
    .catch(function(err) {
      next(err);
    });
};

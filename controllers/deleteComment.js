const { removeComment } = require("../models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  if (/\D+/.test(comment_id)) {
    return res.status(400).send({ message: "Bad request" });
  }
  return removeComment({ comment_id })
    .then(function(data) {
      if (data === 0) {
        return res.status(422).send({ message: "Unprocessable entity" });
      }
      return res.status(204).send({});
    })
    .catch(function(err) {
      next(err);
    });
};

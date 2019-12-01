const { updateComment } = require("../models");

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  // custom 400 if {comment_id} or inc_votes not a number
  const testValue = inc_votes < 0 ? -inc_votes : inc_votes;
  if (
    /\D+/.test(testValue) ||
    /\D+/.test(comment_id) ||
    String(inc_votes).length === 0
  ) {
    return res.status(400).send({ message: "Bad request" });
  }
  return updateComment({ comment_id }, inc_votes)
    .then(function(comment) {
      if (!comment) {
        return res.status(422).send({ message: "Unprocessable entity" });
      }
      return res.status(200).send({ comment });
    })
    .catch(function(err) {
      next(err);
    });
};

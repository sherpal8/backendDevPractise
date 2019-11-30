const { updateComment } = require("../models");

exports.patchComment = (req, res, next) => {
  return updateComment()
    .then(function(comment) {
      return res.status(200).send({ comment });
    })
    .catch(function(err) {
      next(err);
    });
};

const { sendComment } = require("../models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const dataObj = req.body;
  const dataObjCopy = { ...dataObj };
  dataObjCopy.author = dataObjCopy.username;
  delete dataObjCopy.username;
  dataObjCopy.article_id = article_id;
  return sendComment(dataObjCopy)
    .then(function([comment]) {
      return res.status(201).send({ comment });
    })
    .catch(function(err) {
      next(err);
    });
};

const { sendComment, fetchArticle, fetchUser } = require("../models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body || username.length === 0 || body.length === 0) {
    return res.status(400).send({
      message: "Bad request"
    });
  }
  const dataObjCopy = {
    ...req.params
  };
  dataObjCopy.author = username;
  dataObjCopy.body = body;
  delete dataObjCopy.username;
  dataObjCopy.article_id = article_id;

  // if article_id is not a number
  if (/\D+/.test(article_id)) {
    return res.status(400).send({
      message: "Bad request"
    });
  }

  // check if article exists in 'articles' table before POST
  const checkIdAndPost = function() {
    return fetchArticle(article_id)
      .then(function(value) {
        if (value.length === 0) {
          // if article_id does not exist, status 422
          return res.status(422).send({
            message: "Unprocessable entity"
          });
        }
        // if article_id exists, to proceed with the seeding of 'comments' schema
        return sendComment(dataObjCopy);
      })
      .then(function([comment]) {
        return res.status(201).send({ comment });
      })
      .catch(function(err) {
        next(err);
      });
  };

  // first, check to see if username/author is registered in `users` table
  return fetchUser({ username }).then(function(userData) {
    // if user does not exist
    if (userData.length === 0) {
      return res.status(422).send({
        message: "Unprocessable entity"
      });
    }
    // else
    checkIdAndPost();
  });
};

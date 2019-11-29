const { fetchArticleComments, fetchArticle } = require("../models");

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params;
  let { sort_by, order_by } = req.query;
  const acceptableSortByArr = [
    "created_at",
    "votes",
    "comment_id",
    "author",
    "body",
    "article_id"
  ];
  const acceptableOrderByArr = ["desc", "asc"];
  sort_by = acceptableSortByArr.includes(sort_by) ? sort_by : "created_at";
  order_by = acceptableOrderByArr.includes(order_by) ? order_by : "desc";

  // 400: if article_id not a number
  if (/\D+/.test(article_id.article_id)) {
    return res.status(400).send({
      message: "Bad request"
    });
  }

  return fetchArticle(article_id.article_id)
    .then(function(articleArr) {
      if (articleArr.length === 0) {
        return res.status(422).send({ message: "Unprocessable entity" });
      } else {
        return fetchArticleComments(article_id, sort_by, order_by).then(
          function(comments) {
            return res.status(200).send({ comments });
          }
        );
      }
    })
    .catch(function(err) {
      next(err);
    });
};

const { fetchArticle } = require("../models");

exports.getManyArticles = (req, res, next) => {
  let { sort_by, order_by, author, topic } = req.query;
  const acceptedSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes"
  ];
  const acceptedOrderBy = ["asc", "desc"];
  sort_by = acceptedSortBy.includes(sort_by) ? sort_by : "created_at";
  order_by = acceptedOrderBy.includes(order_by) ? order_by : "desc";
  return fetchArticle(null, sort_by, order_by, author, topic)
    .then(function(articles) {
      return res.status(200).send({ articles });
    })
    .catch(function(err) {
      next(err);
    });
};

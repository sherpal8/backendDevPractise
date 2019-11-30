const { fetchArticle } = require("../models");

exports.getManyArticles = (req, res, next) => {
  let { sort_by, order_by, author, topic } = req.query;

  // ensure only authories queries allowed
  const authorisedQueries = ["sort_by", "order_by", "author", "topic"];
  const queryEntered = Object.keys(req.query);
  const unauthorisedQueries = queryEntered.filter(function(query) {
    return !authorisedQueries.includes(query);
  });
  if (unauthorisedQueries.length > 0) {
    return res.status(400).send({ message: "Bad request" });
  }

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
      if (articles.length === 0) {
        return res.status(404).send({ message: "Page not found" });
      }
      return res.status(200).send({ articles });
    })
    .catch(function(err) {
      next(err);
    });
};

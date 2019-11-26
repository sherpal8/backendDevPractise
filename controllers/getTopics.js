const { fetchTopics } = require("../models");

exports.getTopics = function(req, res, next) {
  return fetchTopics().then(function(topics) {
    res.status(200).send({ topics });
  });
};

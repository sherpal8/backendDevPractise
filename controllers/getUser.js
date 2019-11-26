const { fetchUser } = require("../models");

exports.getUser = function(req, res, next) {
  const username = req.params;
  return fetchUser(username).then(function(user) {
    res.status(200).send({ user });
  });
};

const { fetchUser } = require("../models");

exports.getUser = function(req, res, next) {
  const username = req.params;
  return fetchUser(username).then(function(user) {
    if (user.length === 0) {
      res.status(404).send({ message: "Page does not exist" });
    } else {
      res.status(200).send({ user });
    }
  });
};

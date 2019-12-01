const { fetchUser } = require("../models");

exports.getUser = function(req, res, next) {
  const username = req.params;
  return fetchUser(username).then(function(userData) {
    if (userData.length === 0) {
      res.status(404).send({ message: "Page does not exist" });
    } else {
      let user = userData[0];
      res.status(200).send({ user });
    }
  });
};

const { connection } = require("../connection");

exports.fetchUser = function(username) {
  return connection("users")
    .select("*")
    .where(username)
    .then(function(data) {
      return data;
    });
};

const { connection } = require("../connection");

exports.fetchTopics = function() {
  return connection("topics")
    .select("*")
    .then(function(data) {
      return data;
    });
};

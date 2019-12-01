const { connection } = require("../connection");

exports.updateComment = (comment_id, inc_votes = 0) => {
  return connection("comments")
    .increment("votes", inc_votes)
    .where(comment_id)
    .then(function() {
      // .then() as knex.returning() incompatible with sqlite3
      return connection("comments")
        .select("*")
        .where(comment_id);
    })
    .then(function(data) {
      return data[0];
    });
};

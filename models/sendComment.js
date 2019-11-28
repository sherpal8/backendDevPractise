const { connection } = require("../connection");

exports.sendComment = dataObj => {
  return connection("comments")
    .insert(dataObj)
    .then(function([comment_id]) {
      // .returning() does not work in sqlite3, hence .then() chaining
      return connection("comments")
        .select("*")
        .where({ comment_id });
    });
};

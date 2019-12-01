const { connection } = require("../connection");

exports.removeComment = comment_id => {
  return connection("comments")
    .del()
    .where(comment_id);
};

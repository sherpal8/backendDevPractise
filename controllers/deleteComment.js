const { removeComment } = require("../models");

exports.deleteComment = (req, res, next) => {
  return removeComment().then(function(val) {
    console.log(val);
  });
};

const { errorHandler400 } = require("./errorHandler400");
const { errorHandler422 } = require("./errorHandler422");
const { errorHandler404 } = require("./errorHandler404");
const { errorHandler500 } = require("./errorHandler500");
const { errorHandler405 } = require("./errorHandler405");

module.exports = {
  errorHandler400,
  errorHandler422,
  errorHandler404,
  errorHandler500,
  errorHandler405
};

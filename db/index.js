"use strict";

const ENV = process.env.NODE_ENV || "development";

const developmentData = require("./development-data");
const test = require("./test-data");

const dataObj = {
  development: developmentData,
  production: developmentData,
  test
};

module.exports = dataObj[ENV];

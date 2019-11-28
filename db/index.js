"use strict";

let ENV = process.env.NODE_ENV || "development";
// note: when app.spec.js called, process.env.NODE_ENV set to 'test' in there.

const developmentData = require("./development-data");
const test = require("./test-data");

const dataObj = {
  development: developmentData,
  production: developmentData,
  test
};

module.exports = dataObj[ENV];

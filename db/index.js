"use strict";

const ENV = process.env.NODE_ENV || "development";

const development = require("./development-data");
const test = require("./test-data");

const dataObj = { development, test };

module.exports = dataObj[ENV];

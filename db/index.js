"use strict";

const ENV = process.env.NODE_ENV || "development";

const development, production = require("./development-data");
const test = require("./test-data");

const dataObj = { development, production, test };

module.exports = dataObj[ENV];

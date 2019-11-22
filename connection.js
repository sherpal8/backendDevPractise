"use strict";

const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL } // this is for production db
    : require("./knexfile"); // this is for test/ development db;

const connection = knex(dbConfig);

module.exports = connection;

"use strict";

const { username, password } = require("./config.js");
let ENV = process.env.NODE_ENV || "development";
// ENV = "test";  ---> to seed 'est' db i.e. sqlite3

const baseConfig = {
  migrations: {
    tableName: "knex_migrations"
  },
  seeds: { directory: "./seeds" },
  debug: false
};

const customConfig = {
  test: {
    client: "sqlite3",
    connection: {
      filename: "./testDB.sqlite3"
    },
    pool: {
      // programatically turn on foreign_keys in sqlite3
      afterCreate: function afterCreateConn(conn, cb) {
        conn.run("PRAGMA foreign_keys=ON", cb);
      }
    },
    useNullAsDefault: true
  },

  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "backend_dev_practise",
      username,
      password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

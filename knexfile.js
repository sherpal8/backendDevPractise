const { username, password } = require("./config.js");
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

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
      filename: "./dev.sqlite3"
    },
    pool: {
      // programatically turn on FOREIGN_KEYS in sqlite3
      afterCreate: function afterCreateConn(conn, cb) {
        conn.run("PRAGMA foreign_keys=ON", cb);
      }
    },
    useNullAsDefault: false
  },

  development,
  production: {
    client: "postgresql",
    connection:
      {
        host: "localhost",
        database: "backendDevPractise",
        username,
        password
      } || `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

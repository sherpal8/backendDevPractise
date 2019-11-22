exports.up = function(knex) {
  return knex.schema
    .createTable("users", function(table) {
      table
        .string("username", 50)
        .primary()
        .unique()
        .notNullable();
      table
        .string("avatar_url", 255)
        .unique()
        .notNullable();
      table.string("name", 50).notNullable();
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("users").then(function(exists) {
        if (exists) {
          console.log("users table created successfully");
        }
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("users")
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("users").then(function(exists) {
        if (!exists) {
          console.log("users table deleted successfully");
        }
      });
    });
};

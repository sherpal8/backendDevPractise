exports.up = function(knex) {
  return knex.schema
    .createTable("topics", function(table) {
      table
        .string("slug", 50)
        .primary()
        .unique()
        .notNullable();
      table.text("description").notNullable();
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("topics").then(function(exists) {
        if (exists) {
          console.log("topics table created successfully");
        }
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("topics")
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("topics").then(function(exists) {
        if (!exists) {
          console.log("topics table deleted successfully");
        }
      });
    });
};

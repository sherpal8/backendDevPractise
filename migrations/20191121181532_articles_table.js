exports.up = function(knex) {
  return knex.schema
    .createTable("articles", function(table) {
      table
        .increments("article_id")
        .primary()
        .notNullable();
      table.string("title", 100).notNullable();
      table.string("body", 2000);
      table.integer("votes").defaultTo(0);
      table
        .string("topic", 300)
        .notNullable()
        .references("slug")
        .inTable("topics")
        .onDelete("CASCADE");
      table
        .string("author", 100)
        .notNullable()
        .references("username")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .date("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("articles").then(function(exists) {
        if (exists) {
          // console.log("articles table created successfully");
        }
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("articles")
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("articles").then(function(exists) {
        if (!exists) {
          // console.log("articles table deleted successfully");
        }
      });
    });
};

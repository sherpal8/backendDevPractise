exports.up = function(knex) {
  return knex.schema
    .createTable("articles", function(table) {
      table
        .increments("article_id")
        .primary()
        .notNullable();
      table.string("title", 50).notNullable();
      table.text("body");
      table.integer("votes").defaultTo(0);
      table
        .string("topic", 255)
        .notNullable()
        .references("slug")
        .inTable("topics")
        .onDelete("CASCADE");
      table
        .string("author", 50)
        .notNullable()
        .references("username")
        .inTable("users");
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
          console.log("articles table created successfully");
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
          console.log("articles table deleted successfully");
        }
      });
    });
};

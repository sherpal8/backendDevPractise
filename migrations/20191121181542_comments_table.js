exports.up = function(knex) {
  return knex.schema
    .createTable("comments", function(table) {
      table
        .increments("comment_id")
        .primary()
        .notNullable();
      table
        .string("author", 50)
        .references("username")
        .inTable("users")
        .onDelete("CASCADE")
        .notNullable();
      table
        .integer("article_id")
        .references("article_id")
        .inTable("articles")
        .onDelete("CASCADE")
        .notNullable();
      table.integer("votes").defaultTo(0);
      table
        .date("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table.text("body").notNullable();
    })
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("comments").then(function(exists) {
        if (exists) {
          // console.log("comments table created successfully");
        }
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("comments")
    .catch(function(error) {
      console.log(error);
    })
    .then(function() {
      return knex.schema.hasTable("comments").then(function(exists) {
        if (!exists) {
          // console.log("comments table deleted successfully");
        }
      });
    });
};

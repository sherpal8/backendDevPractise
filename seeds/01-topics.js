const { topicsData } = require("../db");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("topics")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("topics").insert(topicsData);
    });
};

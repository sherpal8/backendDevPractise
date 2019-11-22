const { articlesData } = require("../db");
const { modifyDateFunc } = require("../db/utils");

exports.seed = function(knex) {
  const modifiedArticlesData = modifyDateFunc(articlesData);
  // Deletes ALL existing entries
  return knex("articles")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("articles").insert(modifiedArticlesData);
    });
};

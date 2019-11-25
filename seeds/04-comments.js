const { commentsData } = require("../db");
const { modifyCommentsData } = require("../db/utils");

exports.seed = function(knex) {
  // use utils function to create a new array of objs with desired properties
  let modifiedCommentsData = modifyCommentsData(commentsData);
  // Deletes ALL existing entries
  return knex("comments")
    .del()
    .then(function() {
      const belongsToArr = modifiedCommentsData.map(
        eachObj => eachObj.article_id
      );
      return knex("articles")
        .select("article_id")
        .whereIn("title", belongsToArr);
    })
    .then(function(articleIdArr) {
      let finalArr = [];
      for (let i = 0; i < articleIdArr.length; i++) {
        modifiedCommentsData[i].article_id = articleIdArr[i].article_id;
        finalArr.push(modifiedCommentsData[i]);
      }
      return finalArr;
    })
    .then(function(finalArr) {
      return knex("comments").insert(finalArr);
    });
};

const { commentsData } = require("../db");
const { modifyCommentsData, processComments } = require("../db/utils");

exports.seed = function(knex) {
  // use utils function to create a new array of objs with desired properties
  let modifiedCommentsData = modifyCommentsData(commentsData);
  const belongsToArr = modifiedCommentsData.map(eachObj => eachObj.belongs_to);
  return knex("articles")
    .select("article_id")
    .whereIn("title", belongsToArr)
    .then(function(articleIdArr) {
      let finalArr = processComments(modifiedCommentsData, articleIdArr);
      // Deletes ALL existing entries
      return knex("comments")
        .del()
        .insert(finalArr);
    });
};

"use strict";

// use 'connection.js' to establish knex connex in utils
const db = require("../../connection");

const modifyDateFunc = function(arrOfObj) {
  return arrOfObj.map(function(eachObj) {
    const eachObjCopy = { ...eachObj };
    eachObjCopy.created_at = new Date(eachObjCopy.created_at).toUTCString();
    return eachObjCopy;
  });
};

const modifyCommentsData = async function(arrOfObj) {
  if (arrOfObj.length === 0) return [];
  // map a new array of belongs_to values only
  const belongsToArr = arrOfObj.map(eachObj => eachObj.belongs_to);
  // use the belongsToArr to extract article_id(s)
  return db("articles")
    .select("article_id")
    .whereIn("title", belongsToArr)
    .then(function(dataArr) {
      return dataArr;
    })
    .then(function(dataArr) {
      return arrOfObj.map((eachObj, index) => {
        // process properties of each obj
        const eachObjCopy = { ...eachObj };
        eachObjCopy.article_id = dataArr[index].article_id;
        eachObjCopy.author = eachObjCopy.created_by;
        eachObjCopy.created_at = new Date(eachObjCopy.created_at).toUTCString();
        delete eachObjCopy.created_by;
        delete eachObjCopy.belongs_to;
        return eachObjCopy;
      });
    })
    .catch(function(error) {
      console.log(error);
    })
    .finally(function() {
      db.destroy();
      return;
    });
};

module.exports = { modifyDateFunc, modifyCommentsData };

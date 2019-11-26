"use strict";

const modifyDateFunc = function(arrOfObj) {
  return arrOfObj.map(function(eachObj) {
    const eachObjCopy = { ...eachObj };
    eachObjCopy.created_at = new Date(eachObjCopy.created_at).toUTCString();
    return eachObjCopy;
  });
};

const modifyCommentsData = function(commentsData) {
  // return array of objects for seeding
  return commentsData.map(eachObj => {
    const eachObjCopy = { ...eachObj };
    eachObjCopy.author = eachObjCopy.created_by;
    eachObjCopy.created_at = new Date(eachObjCopy.created_at).toUTCString();
    delete eachObjCopy.created_by;
    return eachObjCopy;
  });
};

const processComments = function(modifiedCommentsData, articleIdArr) {
  let finalArr = [];
  articleIdArr.forEach((eachObj, i) => {
    modifiedCommentsData[i].article_id = eachObj.article_id;
    delete modifiedCommentsData[i].belongs_to;
    finalArr.push(modifiedCommentsData[i]);
  });
  return finalArr;
};

module.exports = { modifyDateFunc, modifyCommentsData, processComments };

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
    eachObjCopy.article_id = eachObjCopy.belongs_to;
    delete eachObjCopy.created_by;
    delete eachObjCopy.belongs_to;
    return eachObjCopy;
  });
};

module.exports = { modifyDateFunc, modifyCommentsData };

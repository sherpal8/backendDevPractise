exports.modifyDateFunc = function modifyDateOfObjArr(arrOfObj) {
  const arrOfObjCopy = [...arrOfObj];
  return arrOfObjCopy.map(function(eachObj) {
    let eachObjCopy = { ...eachObj };
    eachObjCopy.created_at = new Date(eachObjCopy.created_at).toUTCString();
    return eachObjCopy;
  });
};

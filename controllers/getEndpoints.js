const endpointsData = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  return res.status(200).send(endpointsData);
};

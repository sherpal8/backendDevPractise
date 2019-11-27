exports.errorHandler404 = (err, req, res, next) => {
  const codes = ["404"];
  if (codes.includes(err.code) || codes.includes(err.status)) {
    res.status(404).send({ message: "Page does not exist" });
  } else {
    next(err);
  }
};

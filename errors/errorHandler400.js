exports.errorHandler400 = (err, req, res, next) => {
  const codes = ["22P02", "42703", "23502", "400"];
  if (codes.includes(err.code) || codes.includes(err.status)) {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};

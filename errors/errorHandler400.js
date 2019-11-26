exports.errorHandler400 = (err, req, res, next) => {
  const codes = ["22P02", "42703", "23502"];
  if (codes.includes(err.code)) {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};

exports.errorHandler422 = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(422).send({ message: "Unprocessable entity" });
  } else {
    next(err);
  }
};

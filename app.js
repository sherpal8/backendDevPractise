const express = require("express");
const app = express();
const { apiRouter } = require("./router/apiRouter");
const _ = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

// custom error handler for stray endpoints
app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Page does not exist" });
});

// psql error handlers
app.use(_.errorHandler400);
app.use(_.errorHandler404);
app.use(_.errorHandler422);
app.use(_.errorHandler500);
// controller 405 handler
app.use(_.errorHandler405);

module.exports = { app };

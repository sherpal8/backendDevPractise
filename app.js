const express = require("express");
const app = express();
const { apiRouter } = require("./router/apiRouter");

app.use(express.json());

app.use("/api", apiRouter);

// custom error handler for stray endpoints
app.use("*", (req, res, next) => {
  res.status(404).send({ message: "Page does not exist" });
});

// to create psql error handlers

module.exports = { app };

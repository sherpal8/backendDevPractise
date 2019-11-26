const express = require("express");
const app = express();
const apiRouter = require("./router/apiRouter");

app.use(express.json());

app.use("/api", apiRouter);

// to create error handler for stray endpoints

// to create psql error handlers

module.exports = app;

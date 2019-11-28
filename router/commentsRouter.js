const express = require("express");
const commentsRouter = express.Router();
const _ = require("../controllers");
const e = require("../errors");

commentsRouter.route("/").all(e.errorHandler405);

module.exports = { commentsRouter };

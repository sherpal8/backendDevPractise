const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers");

usersRouter.get("/:username", getUser);

module.exports = { usersRouter };

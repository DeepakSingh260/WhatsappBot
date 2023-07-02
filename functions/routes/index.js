const express = require("express");
const Check = require("./check")
const routes = express.Router();
routes.use("/check" ,Check )
module.exports = routes
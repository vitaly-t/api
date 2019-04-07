"use strict";
let process = require("process");
require("dotenv").config({ silent: process.env.NODE_ENV === "production" });
let http = require("http");
let app = require("./app");

http.createServer(app).listen(3001, function() {
  console.log("Express server listening on port %s", 3001);
});

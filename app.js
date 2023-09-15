"use strict";

/** Express app for Lunchly. */

const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const { NotFoundError } = require("./expressError");

const app = new express();

// Parse body for urlencoded (traditional form) data
app.use(express.urlencoded());

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

app.use(routes);

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and renders error template. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).render("error.html", { err: { message, status } });
});

module.exports = app;

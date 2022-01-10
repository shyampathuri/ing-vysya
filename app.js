// starting file to execute
const express = require("express");
var cors = require("cors");
const d2m = require("./helpers/d2m.helper");
require("dotenv").config();

const routes = require("./routes/app.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(routes);

// error handler
app.use(function (err, req, res, next) {
  if (err || req.status >= 400) {
    //set locals, only providing error in development
    res.locals.message = err;
    res.locals.error = process.env.SHOW_ERRORS === "true" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
  }
});

/**
 * to start server
 */

app.listen(8080, (err) => {
  if (err) {
    console.log("Failed to start server: ", err);
  } else {
    d2m
      .loadAtmData("atmdata.json")
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => {
        console.log("Failed to load data");
        console.log(err);
      });

    d2m
      .loadUserData("users.json")
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => {
        console.log("Failed to load data");
        console.log(err);
      });

    console.log("Server is running on: http://localhost:8080");
  }
});

module.exports = app;
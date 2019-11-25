const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const passport = require("passport");
const dateFns = require("date-fns");

const mainRouter = require("./routes/main");
const candidateRouter = require("./routes/candidate");
const employerRouter = require("./routes/employer");
const data = require("./data");

const gFunctions = require("./handlers/functions");

const app = express();

// .env setup
require("dotenv").config();

// mongoose setup
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.connection.on("error", err => {
  console.error(err.message);
});

// models
require("./models/User");
require("./models/Job");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET
  })
);

// passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// locals
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.gfunctions = gFunctions;
  res.locals.globalData = data;
  res.locals.dateFns = dateFns;

  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", mainRouter);
app.use("/candidate", candidateRouter);
app.use("/employer", employerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

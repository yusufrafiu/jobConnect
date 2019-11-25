const bcrypt = require("bcryptjs");
const User = require("./../models/User");
const passport = require("passport");
const gravatar = require("gravatar");

function dataFor(session) {
  let data = {};
  if (typeof session.data !== undefined) {
    data = session.data;
  }

  return data;
}

exports.homepage = (req, res) => {
  res.render("index");
};

exports.showLogin = (req, res) => {
  res.render("login");
};

exports.login = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash(
        "danger",
        "Username & Password combination doesn't match any of our records"
      );
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect(`${req.user.account}/dashboard`);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You've successfully logged out");
  res.redirect("/login");
};

exports.register = (req, res) => {
  res.render("register");
};

exports.checkRegistration = (req, res) => {
  let data = {
    account: req.body.account,
    email: req.body.email
  };

  if (Object.keys(req.body).includes("firstname")) {
    data.firstname = req.body.firstname;
  } else {
    data.company = req.body.company;
  }

  req.session.data = data;
  if (data.account == "candidate") {
    res.redirect("/register/candidate");
  } else if (data.account == "intern") {
    res.redirect("/register/intern");
  } else {
    res.redirect("register/employer");
  }
};

exports.socialLogin = (req, res) => {
  res.render("social-login");
};

exports.employerRegister = (req, res) => {
  const data = dataFor(req.session);
  res.render("employer-register", { data });
};

exports.internRegister = (req, res) => {
  const data = dataFor(req.session);
  res.render("intern-register", { data });
};

exports.candidateRegister = (req, res) => {
  const data = dataFor(req.session);
  res.render("candidate-register", { data });
};

exports.registerUser = async (req, res) => {
  const backURL = req.header("Referer");

  // 1. check if email already exits
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "email is already registered");
    res.status(400).redirect(backURL);
  }

  // 2. validations

  // 3. create user
  let data = {};

  data.avatar = gravatar.url(req.body.email, {
    s: 400,
    r: "pg",
    d: "mp"
  });

  if (req.body.account !== "employer") {
    data.firstName = req.body.firstname;
    data.lastName = req.body.lastname;
  } else {
    data.companyName = req.body.company_name;
    data.field = req.body.job_field;
  }

  data.password = bcrypt.hashSync(req.body.password, 12);
  data.email = req.body.email;
  data.phone = req.body.phone;
  data.account = req.body.account;

  user = await User.create(data);
  req.flash("success", "Registration is successfull, Please Login");
  res.redirect("/login");
};

const Job = require("../models/Job");
const backURL = req => req.header("referer");

exports.dashboard = async (req, res) => {
  // 1 find jobs by employer
  const jobs = await Job.find({ author: req.user.id })
    .sort({ created: -1 })
    .limit(5);

  res.render("employer-dashboard", { jobs });
};

exports.applicantToJobPost = (req, res) => {
  res.render("employer-applicant-to-job-post");
};

exports.applicantsToJobPost = (req, res) => {
  res.render("employer-applicants-to-job-post");
};

exports.createJobPost = (req, res) => {
  if (req.session.start == undefined) res.render("employer-create-job");

  const start = req.session.start;
  req.session.start = null;
  res.render("employer-create-job", { start });
};

exports.saveJobPost = async (req, res) => {
  // 1. validate input

  // 2. assign values
  const {
    title,
    field,
    qualification,
    deadline,
    experience,
    availability,
    location,
    description
  } = req.body;
  const salaryRange = req.body.salary_range,
    author = req.user._id,
    keywords = req.body.keywords.split(", ");

  const parameters = {
    title,
    field,
    qualification,
    deadline,
    experience,
    availability,
    location,
    keywords,
    description,
    salaryRange,
    author
  };

  // 3. save in db, check if params.id exits
  if (req.params.id != undefined) {
    const job = await Job.findByIdAndUpdate(req.params.id, parameters);
  } else {
    const job = await new Job(parameters).save();
  }

  // 4. set flash message and redirect to job post page
  req.flash(
    "success",
    `Job titled "${title.toUpperCase()}" ${
      req.params.id ? "edited" : "posted"
    } successfully`
  );

  res.redirect("/employer/dashboard");
};

exports.showJobPost = async (req, res) => {
  const job = await Job.findById(req.params.id);

  res.render("employer-show-job", { job });
};

exports.editJobPost = async (req, res) => {
  const id = req.params.id,
    job = await Job.findById(id);

  if (job.author != req.user.id) {
    res.redirect(backURL(req));
  }
  res.render("employer-edit-job", { job });
};

exports.editSettings = (req, res) => {
  res.render("employer-edit-settings");
};

exports.deleteJobPost = async (req, res) => {
  // res.send("working good");
  const job = await Job.findOneAndDelete(req.params.id);
  req.flash("success", `"${job.title}" deleted successfully`);
  res.redirect("/employer/dashboard");
};

exports.startCreatingJobPost = (req, res) => {
  // const start = req.body;
  const { title, field } = req.body;
  req.session.start = { title, field };
  res.redirect("/employer/jobs/create");
};

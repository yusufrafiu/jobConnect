const User = require("../models/User");
const Job = require("../models/Job");
const uploadFile = require("../handlers/uploadfile");

const backURL = req => req.header("Referer");

const updateProfile = {
  personal_details: async (req, res) => {
    // 1. check type params
    if (req.params.type !== "personal_details") {
      res.redirect("/candidate/profile");
    }

    // 2. validate inputs

    // 3. save document
    const user = await User.findOne({
      email: req.user.email
    });
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.gender = req.body.gender;
    user.personalStatement = req.body.personal_statement;
    user.address = req.body.address;
    user.location = req.body.location;
    user.dateOfBirth = req.body.dob;

    if (user.save()) return true;
  },
  prospective_job: async (req, res) => {
    // 1. check type params
    if (req.params.type !== "prospective_job") {
      res.redirect("/candidate/profile");
    }

    // 2. validate inputs

    // 3. save document
    const user = await User.findOne({
      email: req.user.email
    });

    const data = {
      title: req.body.title,
      field: req.body.field,
      availability: req.body.availability,
      salaryRange: req.body.salary_range,
      location: req.body.location
    };

    if (user.prospectiveJob.length == 0) {
      user.prospectiveJob.push(data);
    } else {
      user.prospectiveJob.splice(0, 1, data);
    }

    if (user.save()) return true;
  },
  education: async (req, res) => {
    // 1. check type params
    if (req.params.type !== "education") {
      res.redirect("/candidate/profile");
    }

    // 2. validate inputs

    // 3. find user and assign data
    const user = await User.findOne({
      email: req.user.email
    });

    const data = {
      course: req.body.course,
      degree: req.body.degree,
      school: req.body.school,
      country: req.body.country,
      grade: req.body.grade,
      year: req.body.year
    };

    // 4. check if it's an already registered doc
    if (req.body.id !== undefined) {
      res.send(req.body.id);
      const education = user.education.id(req.body.id);

      if (typeof education === "object") {
        // get index of education
        const index = user.education
          .map(i => {
            return i.id;
          })
          .indexOf(education.id);

        res.send(index);

        user.education.splice(index, 1, data);
      } else {
        user.education.push(data);
      }
    } else res.send("not it");

    // 4. save document
    // if (user.save()) return true;
  }
};

exports.dashboard = async (req, res) => {
  const jobs = await Job.find().limit(10);
  const currentJobs = jobs.map(job => {
    return {
      title: job.title,
      id: job.id
    };
  });
  res.render("candidate-dashboard", { currentJobs });
};

exports.showJob = async (req, res) => {
  // 1. find job
  const job = await Job.findById(req.params.id)
    .populate("author")
    .populate("candidates");

  // 2. if there is no job, redirect back
  if (typeof job !== "object") {
    res.redirect(backURL(req));
  }

  // 3. check if user applied for job
  const isApplied = id => {
    if (job.candidates.length > 0) {
      return job.candidates
        .map(candidate => {
          return candidate.id;
        })
        .includes(id);
    }
    return false;
  };

  // 4. render job view with data
  res.render("candidate-show-job", { job, isApplied });
};

exports.showJobApplication = async (req, res) => {
  // 1. find job
  const job = await Job.findById(req.params.id)
    .populate("author")
    .populate("candidates");

  // 2. if there is no job, redirect back
  if (typeof job !== "object") {
    res.redirect(backURL(req));
  }

  // 3. render view with 'job' data
  res.render("candidate-apply-to-job", { job });
};

exports.searchJobs = (req, res) => {
  res.render("candidate-job-search");
};

exports.settings = (req, res) => {
  res.render("candidate-settings");
};

exports.showProfile = (req, res) => {
  res.render("candidate-profile");
};

exports.showUpdateProfile = async (req, res) => {
  const type = req.params.type,
    data = { type };

  if (req.params.type === "education") {
    if (req.query.id) {
      const user = await User.findById(req.user.id);
      data.education = user.education.id(req.query.id);
    }
  }

  res.render("candidate-update-profile", data);
};

exports.updateProfile = async (req, res) => {
  if (updateProfile[req.params.type](req, res)) {
    // set flash message and redirect
    req.flash("success", "successfully updated your personal details");
  }
  res.redirect(`/candidate/profile`);
};

exports.showUpdateResume = (req, res) => {
  res.render("candidate-upload-resume");
};

exports.appliedJobs = (req, res) => {
  res.render("candidate-jobs-applied-for");
};

exports.uploadCV = async (req, res) => {
  // 1. set details
  const details = {
    destination: "./public/uploads/cvs/",
    field: "cv",
    fileLimit: 500000,
    allowedExts: "pdf|doc|docx"
  };

  // 2. initialize upload
  const upload = uploadFile(req, details);

  // 3. handle upload
  upload(req, res, async err => {
    let error;
    if (err) {
      error = err.message;
    } else {
      // check if file is not uploaded
      if (req.file == undefined) {
        error = "no file was uploaded";
      }
    }

    // if error, set flash message and redirect
    if (!!error) {
      req.flash("danger", error);
      res.redirect(backURL(req));
    } else {
      // no errors, handle path
      const cvPath = `/${req.file.path
        .split("\\")
        .slice(1)
        .join("/")}`;
      // save path in db
      const user = await User.findOne({ email: req.user.email });
      user.cvPath = cvPath;
      user.save();
      req.flash("success", "CV uploaded successfully");
      res.redirect("/candidate/dashboard");
    }
  });
};

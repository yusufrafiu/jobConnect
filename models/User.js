const mongoose = require("mongoose");

const prospectiveJobSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  field: String,
  availability: String,
  salaryRange: String,
  location: String
});

const educationSchema = new mongoose.Schema({
  course: {
    type: String,
    trim: true
  },
  degree: String,
  school: {
    type: String,
    trim: true
  },
  grade: String,
  location: String,
  year: Date
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "Please supply an email address",
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: Number,
    required: "Please supply your phone Number",
    trim: true
  },
  dateOfBirth: Date,
  firstName: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  address: String,
  avatar: String,
  gender: {
    type: String,
    default: "male"
  },
  account: {
    type: String,
    default: "candidate",
    required: true
  },
  avatar: {
    required: true,
    type: String
  },
  personalStatement: {
    type: String,
    trim: true
  },
  cvPath: {
    type: String,
    trim: true
  },
  aboutCompany: {
    type: String,
    trim: true
  },
  jobsPosted: {
    type: String,
    trim: true
  },
  field: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  location: String,
  prospectiveJob: [prospectiveJobSchema],
  education: [educationSchema]
});

userSchema.method("profileStrength", () => {
  return 100;
});

module.exports = mongoose.model("User", userSchema);

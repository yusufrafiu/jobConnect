const mongoose = require("mongoose");
const moment = require("moment");
// const mongoosePaginate = require("mongoose-paginate");

const JobSchema = mongoose.Schema({
  title: {
    type: String,
    required: "Please supply the job title",
    trim: true
  },
  field: {
    type: String,
    required: "Please supply the job field",
    trim: true
  },
  qualification: {
    type: String,
    required: "Please supply the qualification for the job",
    trim: true
  },
  experience: {
    type: String,
    required: "Please supply the job field",
    trim: true
  },
  deadline: {
    type: Date,
    default: Date.now,
    required: "Please provide the job deadline"
  },
  availability: {
    type: String,
    required: "Please provide: is this job a contract or full-time"
  },
  location: {
    type: String,
    required: "Please provide the location",
    trim: true
  },
  salaryRange: {
    type: String
  },
  description: {
    type: String,
    required: "Please provide the description to this job"
  },
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "Please you must provide the author of this job"
  },
  keywords: [String],
  candidates: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }
  ]
});

// JobSchema.plugin(mongoosePaginate);
JobSchema.method("status", () => {
  return moment() >= moment(this.deadline) ? "expired" : "live";
  // return this.deadline;
});

module.exports = mongoose.model("Job", JobSchema);

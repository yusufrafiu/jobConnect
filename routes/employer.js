const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employersController");
const isAuthenticated = require("../controllers/authController");

/* GET users listing. */
router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// router.use(isAuthenticated);

router.get("/dashboard", employerController.dashboard);
router.get("/jobs/create", employerController.createJobPost);
router.post("/jobs/create", employerController.saveJobPost);
router.get("/jobs/:id", employerController.showJobPost);
router.get("/jobs/edit/:id", employerController.editJobPost);
router.get("/jobs/delete/:id", employerController.deleteJobPost);
router.get("/jobs/start-creating", employerController.startCreatingJobPost);
router.get("/jobs/:id/applicants", employerController.applicantsToJobPost);

module.exports = router;

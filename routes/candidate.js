const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidatesController");
const { isAuthenticated } = require("../controllers/authController");

/* GET users listing. */
router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.use(isAuthenticated);

router.get("/dashboard", candidateController.dashboard);
router.get("/profile", candidateController.showProfile);
router.get(
  "/profile/update/:type",

  candidateController.showUpdateProfile
);
router.post("/profile/update/:type", candidateController.updateProfile);
router.post("/upload/cv", candidateController.uploadCV);

router.get("/settings", candidateController.settings);

// jobs
router.get("/jobs/:id", candidateController.showJob);
router.get("/jobs/apply/:id", candidateController.showJobApplication);

module.exports = router;

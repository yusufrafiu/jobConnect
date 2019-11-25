const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");

/* GET home page. */
router.get("/", mainController.homepage);
router.get("/login", mainController.showLogin);
router.post("/login", mainController.login);
router.get("/logout", mainController.logout);
router.get("/register", mainController.register);
router.post("/auth/register", mainController.registerUser);
router.get("/register/candidate", mainController.candidateRegister);
router.get("/register/employer", mainController.employerRegister);
router.get("/register/intern", mainController.internRegister);
router.post("/start-registration", mainController.checkRegistration);

module.exports = router;

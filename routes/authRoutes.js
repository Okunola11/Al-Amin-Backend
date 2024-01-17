const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/").post(authController.handleUserLogin);

router.route("/student").post(authController.handleStudentLogin);

router.route("/refresh").get(authController.handleRefreshToken);

router.route("/logout").post(authController.handleLogout);

module.exports = router;

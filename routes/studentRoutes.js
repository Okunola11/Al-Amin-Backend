const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.postStudent)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;

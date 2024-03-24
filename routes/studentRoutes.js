const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const ROLES = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(
    verifyRoles(ROLES.Admin, ROLES.Executive, ROLES.Employee),
    studentController.postStudent
  )
  .patch(
    verifyRoles(ROLES.Admin, ROLES.Executive, ROLES.Employee),
    studentController.updateStudent
  )
  .delete(
    verifyRoles(ROLES.Admin, ROLES.Executive, ROLES.Employee),
    studentController.deleteStudent
  );

module.exports = router;

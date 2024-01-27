const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const ROLES = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(resultController.getAllResults)
  .post(
    verifyRoles(ROLES.Admin, ROLES.Executive, ROLES.Employee),
    resultController.postResult
  )
  .patch(
    verifyRoles(ROLES.Admin, ROLES.Executive, ROLES.Employee),
    resultController.updateResult
  )
  .delete(
    verifyRoles(ROLES.Admin, ROLES.Executive, ROLES.Employee),
    resultController.deleteResult
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const ROLES = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES.Admin, ROLES.Executive), userController.getAllUsers)
  .post(verifyRoles(ROLES.Admin, ROLES.Executive), userController.postUser)
  .patch(verifyRoles(ROLES.Admin, ROLES.Executive), userController.updateUser)
  .delete(verifyRoles(ROLES.Admin, ROLES.Executive), userController.deleteUser);

module.exports = router;

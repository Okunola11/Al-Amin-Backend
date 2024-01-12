const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

router
  .route("/")
  .get(resultController.getAllResults)
  .post(resultController.postResult)
  .patch(resultController.updateResult)
  .delete(resultController.deleteResult);

module.exports = router;

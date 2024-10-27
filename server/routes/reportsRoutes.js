const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.post("/newReport", reportController.newReport);
router.delete("/deleteReport", reportController.deleteReport);
router.get("/getReportsAndReviews", reportController.getReportsAndReviews);

module.exports = router;
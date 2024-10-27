const express = require("express");
const router = express.Router();
const billboardChartsController = require("../controllers/billboardChartsController");

router.get("/top-albums", billboardChartsController.getTopAlbums);
router.get("/hot-100", billboardChartsController.getHot100);
router.get("/global-200", billboardChartsController.getGlobal200);
router.get("/top-100-artists", billboardChartsController.getTop100Artists);

module.exports = router;
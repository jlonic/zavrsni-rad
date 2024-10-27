const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.post("/add-artist/", adminController.insertArtistIntoDatabase);

module.exports = router;
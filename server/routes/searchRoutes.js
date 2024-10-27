const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/:category/:keyword", searchController.search);

module.exports = router;
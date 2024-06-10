const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

router.get("/all", artistController.getAllArtists);
router.post("/add", artistController.addArtist);
router.delete("/delete/:artist_id", artistController.deleteArtist);
router.put("/update/:artist_id", artistController.updateArtist); //add more after db update
router.get("/:artist_id", artistController.getArtist);


module.exports = router;
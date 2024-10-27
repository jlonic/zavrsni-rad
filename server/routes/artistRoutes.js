const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

router.get("/all", artistController.getAllArtists);
router.post("/add", artistController.addArtist);
router.delete("/delete/:artist_id", artistController.deleteArtist);
router.delete("/delete-all-data/:artist_id", artistController.deleteAllArtistData);
router.put("/update/:artist_id", artistController.updateArtist); 
router.get("/:artist_id", artistController.getArtist);
router.get("/rating/:artist_id", artistController.getArtistRating);
router.put("/soft-delete/:artist_id", artistController.softDeleteArtist);
router.put("/restore/:artist_id", artistController.restoreArtist);
router.get("/soft-deleted/:artist_id", artistController.getSoftDeletedArtist);
router.get("/soft-deleted/all", artistController.getAllSoftDeletedArtists);
router.get("/name/:artist_name", artistController.getArtistByName);

module.exports = router;
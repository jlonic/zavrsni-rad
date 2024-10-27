const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");

router.post("/add", albumController.addAlbum);
router.get("/artist/:artist_id", albumController.getAlbumsByArtist);
router.put("/update/:album_id", albumController.updateAlbum);
router.delete("/delete/:album_id", albumController.deleteAlbum);
router.get("/:album_id", albumController.getAlbumByAlbumId);
router.get("/rating/:album_id", albumController.getAlbumRating);
router.put("/soft-delete/:album_id", albumController.softDeleteAlbum);
router.put("/restore/:album_id", albumController.restoreAlbum);
// router.get("/soft-deleted/:album_id", albumController.getSoftDeletedAlbum);
router.delete("/delete-all-data/:album_id", albumController.deleteAllAlbumData);
router.get("/getAll/:limit/:offset", albumController.getAllAlbums);
router.get("/title/:album_title", albumController.getAlbumByTitle);
router.get("/artist-name/:artist_name", albumController.getAlbumsByArtistName);

module.exports = router;
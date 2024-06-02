const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");

router.post("/add", albumController.addAlbum);
router.get("/artist/:artist_id", albumController.getAlbumsByArtist);
//router.put("/update/:album_id", albumController.updateAlbum);
router.delete("/delete/:album_id", albumController.deleteAlbum);

module.exports = router;
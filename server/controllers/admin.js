const Artists = require('../models/artist');
const Albums = require('../models/album');
const Tracks = require('../models/track');
const jwt = require('jsonwebtoken');

const apiKey = '7dd8457e9e1d61c52a6feecc73261a71'; //lastfm api key

const fetchArtistData = async (artistName) => { //artist summary
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artistName)}&format=json`);
    const data = await response.json();
    return data;
};

const fetchAlbumData = async (artistName, albumName) => { //tracks, duration, tracknumber, album summary
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&format=json`);
    const data = await response.json();
    return data;
};
const cleanSummary = (summary) => { //removes links from summary
    if (summary === '' || summary === null || summary === undefined) {
        return summary = 'No summary available'
    }
    return summary.replace(/<a href=.*<\/a>.*/, '').trim();
}

const insertArtistIntoDatabase = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role != 'administrator') {
            return res.status(401).send('Unauthorized');
        }

        const artistName = req.body.artist_name;
        const existingArtist = await Artists.getArtistByName(artistName);

        if (existingArtist.length > 0) {
            console.log(`Artist "${artistName}" already exists in database. Adding albums and tracks...`);
            insertAlbumsIntoDatabase(artistName);
        }
        artistData = await (fetchArtistData(artistName));

        const response = await fetch(`https://api.deezer.com/search/album?q=${artistName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        const artist_image = data.data[0].artist.picture_xl;

        summary = cleanSummary(artistData.artist.bio.summary);
        if (existingArtist.length === 0) {
            await Artists.addArtist(artistName, artist_image, summary);
        }
        await insertAlbumsIntoDatabase(artistName);
        res.json({ message: 'Data added to database' });
    } catch (error) {
        console.log(error);
    }
};


const insertAlbumsIntoDatabase = async (artistName) => {
    const artist = await Artists.getArtistByName(artistName);
    const artistId = artist[0].artist_id;
    let releaseDate;
    try {
        const response = await fetch(`https://api.deezer.com/search/album?q=${artistName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        let summary = 'No summary available';
        for (let i = 0; i < data.data.length; i++) {
            try {
                albumData = await (fetchAlbumData(artistName, data.data[i].title));

                if (albumData.album && albumData.album.wiki && albumData.album.wiki.content) {
                    summary = cleanSummary(albumData.album.wiki.content);
                }

                const releaseDates = await fetch(`https://api.deezer.com/album/${data.data[i].id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const releaseData = await releaseDates.json();
                releaseDate = releaseData.release_date;
                if (releaseDate === undefined || releaseDate === '' || releaseDate === 0 || releaseDate === '0000-00-00') {
                    releaseDate = null;
                }
            } catch (error) {
                console.log(error);
            }
            let flag = false;
            const existingAlbums = await Albums.getAlbumsByArtist(artistId);
            for (let j = 0; j < existingAlbums.length; j++) {
                if (existingAlbums[j].album_title === data.data[i].title) {
                    flag = true;
                    // console.log(`Album "${data.data[i].title}" already exists in database`)
                }
            }
            if (flag === false) {
                await Albums.addAlbum(data.data[i].title, artistId, releaseDate, data.data[i].cover_xl, data.data[i].record_type, summary);
            }
            // console.log(data.data[i].title, artistId, releaseDate, data.data[i].cover_xl, data.data[i].record_type);
        }

        insertTracksIntoDatabase(artistId, artistName);
    } catch (error) {
        console.log(error);
    }
};

const insertTracksIntoDatabase = async (artistId, artistName) => {
    const albums = await Albums.getAlbumsByArtist(artistId);
    const existingTracks = await Tracks.getTracksByArtist(artistId);
    let albumId;
    let duration;
    let trackNumber;
    let trackName;
    try {
        for (let i = 0; i < albums.length; i++) {
            const albumData = await (fetchAlbumData(artistName, albums[i].album_title));
            if (albumData.album && albumData.album.tracks && albumData.album.tracks.track) {
                const tracksArray = albumData.album.tracks.track;
                for (let j = 0; j < tracksArray.length; j++) {
                    trackName = tracksArray[j].name;
                    duration = tracksArray[j].duration;
                    trackNumber = tracksArray[j]['@attr'].rank;
                    albumId = albums[i].album_id;

                    if (duration === undefined || duration === null || duration === '' || duration === 0) {
                        duration = 0;
                    }
                    if (trackNumber === undefined || trackNumber === null || trackNumber === '' || trackNumber === 0) {
                        trackNumber = 1;
                    }
                    let flag = false;
                    for (let k = 0; k < existingTracks.length; k++) {
                        if (existingTracks[k].track_title === trackName) {
                            flag = true;
                            // console.log(`Track "${trackName}" already exists in database`)
                        }
                    }
                    if (flag === false) {
                        await Tracks.addTrack(albumId, trackName, duration, trackNumber);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

};

module.exports = {
    insertArtistIntoDatabase
};
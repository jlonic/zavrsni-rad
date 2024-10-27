const Artists = require('./models/artist');
const Albums = require('./models/album');
const Tracks = require('./models/track');

const apiKey = '7dd8457e9e1d61c52a6feecc73261a71'; //lastfm api key

//run this file to insert data into the database
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

const insertArtistsIntoDatabase = async () => {
    try {
        const response = await fetch(`http://localhost:5000/charts/top-100-artists`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            artistData = await (fetchArtistData(data[i].artist));
            summary = cleanSummary(artistData.artist.bio.summary)
            await Artists.addArtist(data[i].artist, data[i].image, summary);
        }
    } catch (error) {
        console.log(error);
    }
    insertAlbumsIntoDatabase();
};//100 artists


const insertAlbumsIntoDatabase = async () => {
    let artists = await Artists.getAllArtists();
    let releaseDate;
    try {
        for (let i = 0; i < artists.length; i++) {
            const response = await fetch(`https://api.deezer.com/search/album?q=${(artists[i].artist_name)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            let summary = 'No summary available';
            for (let j = 0; j < data.data.length; j++) {
                try {
                    albumData = await (fetchAlbumData(artists[i].artist_name, data.data[j].title));

                    if (albumData.album && albumData.album.wiki && albumData.album.wiki.content) {
                        summary = cleanSummary(albumData.album.wiki.content);
                    }

                    const releaseDates = await fetch(`https://api.deezer.com/album/${data.data[j].id}`, {
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
                await Albums.addAlbum(data.data[j].title, artists[i].artist_id, releaseDate, data.data[j].cover_xl, data.data[j].record_type, summary);
            }
        }
    } catch (error) {
        console.log(error);
    }
    insertTracksIntoDatabase();
};//2463 albums

const insertTracksIntoDatabase = async () => {
    const albums = await Albums.getAllAlbums();
    let albumId;
    let duration;
    let trackNumber;
    let trackName;
    try {
        for (let i = 0; i < albums.length; i++) {
            const albumData = await (fetchAlbumData(albums[i].artist_name, albums[i].album_title));
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
                    
                    await Tracks.addTrack(albumId, trackName, duration, trackNumber);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}; //16868 tracks


insertArtistsIntoDatabase();
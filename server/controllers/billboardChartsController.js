const { exec } = require("child_process");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 604800 }); // 7 days

const getTopAlbums = async (_, res) => {
    const cachedData = cache.get("topAlbums");
    if (cachedData) {
        res.json(cachedData);
        refreshTopAlbums();
        return;
    }
    refreshTopAlbums(res);
};

const refreshTopAlbums = async (res = null) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getTop200Albums.py", (error, data) => { //for running in docker
        // exec(`python ./python-scripts/getTop200Albums.py`, (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top albums" });
            }

            const parsedData = JSON.parse(data);
            cache.set("topAlbums", parsedData);
            if (res) res.json(parsedData);
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getHot100 = async (_, res) => {
    const cachedData = cache.get("hot-100");
    if (cachedData) {
        res.json(cachedData);
        refreshHot100();
        return;
    }
    refreshHot100(res);
};

const refreshHot100 = async (res = null) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getHot100.py", (error, data) => { //for running in docker
        // exec(`python ./python-scripts/getHot100.py`, (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top songs" });
            }
            const parsedData = JSON.parse(data);
            cache.set("hot-100", parsedData);
            if (res) res.json(parsedData);
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getGlobal200 = async (_, res) => {
    const cachedData = cache.get("global-200");
    if (cachedData) {
        res.json(cachedData);
        refreshGlobal200();
        return;
    }
    refreshGlobal200(res);
};

const refreshGlobal200 = async (res = null) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getGlobal200.py", (error, data) => { //for running in docker
        // exec(`python ./python-scripts/getGlobal200.py`, (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top songs" });
            }
            const parsedData = JSON.parse(data);
            cache.set("global-200", parsedData);
            if (res) res.json(parsedData);
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getTop100Artists = async (_, res) => {
    const cachedData = cache.get("top-100-artists");
    if (cachedData) {
        res.json(cachedData);
        return;
    } 
    refreshTop100Artists(res);
};

const refreshTop100Artists = async (res = null) => {

    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getTop100Artists.py", (error, data) => { //for running in docker
        // exec(`python ./python-scripts/getTop100Artists.py`, (error, data) => { //for running locally
            if (error) {
                console.error(`Exec error: ${error.message}`);
                return res.status(500).send({ message: "Error fetching top artists" });
            }
            const parsedData = JSON.parse(data);
            cache.set("top-100-artists", parsedData);
            if (res) res.json(parsedData);
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

module.exports = {
    getTopAlbums,
    getHot100,
    getGlobal200,
    getTop100Artists
};
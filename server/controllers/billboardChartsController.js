const { exec } = require("child_process");

const getTopAlbums = async (_, res) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getTop200Albums.py", (error, data) => { //for running in docker
        // exec("python ./python-scripts/getTop200Albums.py", (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top albums" });
            }
            res.json(JSON.parse(data));
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getHot100 = async (_, res) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getHot100.py", (error, data) => { //for running in docker
        // exec("python ./python-scripts/getHot100.py", (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top songs" });
            }
            res.json(JSON.parse(data));
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getGlobal200 = async (_, res) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getGlobal200.py", (error, data) => { //for running in docker
        // exec("python ./python-scripts/getGlobal200.py", (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top songs" });
            }
            res.json(JSON.parse(data));
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getTop100Artists = async (_, res) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getTop100Artists.py", (error, data) => { //for running in docker
        // exec("python ./python-scripts/getTop100Artists.py", (error, data) => { //for running locally
            if (error) {
                return res.status(500).send({ message: "Error fetching top artists" });
            }
            res.json(JSON.parse(data));
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
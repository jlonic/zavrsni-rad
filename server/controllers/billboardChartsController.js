const { exec } = require("child_process");

const getTopAlbums = async (_, res) => {
    try {
        console.log("Running Python script...");
        exec("/usr/src/app/venv/bin/python ./python-scripts/getTop200Albums.py", (error, data, stderr) => { //for running in docker
        // exec(`python ./python-scripts/getTop200Albums.py`, (error, data) => { //for running locally
            console.log("Python script finished running...");

            if (error) {
                console.error(`Exec error: ${error.message}`);
                console.error(`Stderr: ${stderr}`);
                return res.status(500).send({ message: "Error fetching top albums" });
            }
            console.log("Python Output:", data);
            console.log("Stderr:", stderr);
            res.json(JSON.parse(data));
        });
    } catch (error) {
        console.error(`Catch error: ${error.message}`);
        res.status(500).json({ message: "Error retrieving charts" });
    }
};

const getHot100 = async (_, res) => {
    try {
        exec("/usr/src/app/venv/bin/python ./python-scripts/getHot100.py", (error, data) => { //for running in docker
        // exec(`python ./python-scripts/getHot100.py`, (error, data) => { //for running locally
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
        // exec(`python ./python-scripts/getGlobal200.py`, (error, data) => { //for running locally
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
        // exec(`python ./python-scripts/getTop100Artists.py`, (error, data) => { //for running locally
            if (error) {
                console.error(`Exec error: ${error.message}`);
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
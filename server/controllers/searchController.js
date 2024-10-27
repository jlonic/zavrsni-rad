const Search = require('../models/search');

const search = async (req, res) => {
    try {
        const { keyword, category } = req.params;
        const results = await Search.search(keyword, category);
        res.json(results);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error searching database" });
    }
};

module.exports = {
    search
};
const Reports = require('../models/report');
const jwt = require('jsonwebtoken');

const newReport = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { review_id, report_text } = req.body;
        const newReport = await Reports.newReport(review_id, user_id, report_text);
        res.json(newReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReport = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator' && user.user_role !== 'moderator') {
            return res.status(403).json({ message: "Permission denied. Only administrators and moderators can delete reports." });
        }

        const { report_id } = req.body;
        const deletedReport = await Reports.deleteReport(report_id);
        res.json(deletedReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReportsAndReviews = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator' && user.user_role !== 'moderator') {
            return res.status(403).json({ message: "Permission denied. Only administrators and moderators can view reports." });
        }

        const reports = await Reports.getReportsAndReviews();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    newReport,
    deleteReport,
    getReportsAndReviews,
};
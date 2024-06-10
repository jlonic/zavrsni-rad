const pool = require("../config/db");

const newReport = async (review_id, user_id, report_text) => {
    const newReport = await pool.query(
        "INSERT INTO reports (review_id, user_id, report_text) VALUES($1, $2, $3) RETURNING *",
        [review_id, user_id, report_text]);
    return newReport.rows;
};

const deleteReport = async (report_id) => {
    const deletedReport = await pool.query(
        "DELETE FROM reports WHERE report_id = $1 RETURNING *",
        [report_id]);
    return deletedReport.rows;
};

module.exports = {
    newReport,
    deleteReport,
};
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "123",
    host: "db", //'localhost' for local development, 'db' for docker
    port: 5432,
    database: "app"
});


module.exports = pool;
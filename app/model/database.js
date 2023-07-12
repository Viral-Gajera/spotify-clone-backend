let mysql = require("mysql2/promise");

const DB = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "spotify",
    waitForConnections: true,
});

if (DB) {
    console.log("Database connected!");
}

module.exports = DB;

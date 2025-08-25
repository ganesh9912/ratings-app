
const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();


const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    connectionLimit:10,
    queueLimit:0,
    waitForConnections:true
});

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database connection successfull");
        connection.release();
    }
     catch(error) {
        console.log("Error connecting to database!");
        throw error;
     }
}

module.exports = { pool, checkConnection };
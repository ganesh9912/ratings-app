const { pool } = require("../config/db.js");

const createUsersTable = async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users2 (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(60) NOT NULL CHECK (CHAR_LENGTH(name) BETWEEN 3 AND 60),
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                address VARCHAR(400),
                role ENUM('admin', 'user', 'owner') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`
        );
        console.log("Users table created successfully");
    } catch (error) {
        console.log("Users table creation failed:", error);
    }
};


const createStoresTable = async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS stores (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(60) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                address VARCHAR(400),
                owner_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users2(id) ON DELETE CASCADE
            );`
        );
        console.log("Stores table created successfully");
    } catch (error) {
        console.log("Stores table creation failed:", error);
    }
};



const createRatingsTable = async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS ratings (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                store_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users2(id) ON DELETE CASCADE,
                CONSTRAINT fk_rating_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
                CONSTRAINT uc_user_store UNIQUE (user_id, store_id)
            );`
        );
        console.log("Ratings table created successfully");
    } catch (error) {
        console.log("Ratings table creation failed:", error);
    }
};

module.exports = { createUsersTable, createStoresTable, createRatingsTable };

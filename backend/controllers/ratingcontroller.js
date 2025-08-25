const { pool } = require("../config/db");


const users = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        -- Average rating for owners, NULL for others
        IFNULL(AVG(r.rating), NULL) AS rating
      FROM users2 u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      GROUP BY u.id, u.name, u.email, u.address, u.role
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
};


const getOwnerStores = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const [stores] = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        IFNULL(AVG(r.rating), 0) AS averageRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
      GROUP BY s.id, s.name, s.email, s.address
    `, [ownerId]);

  
    for (const store of stores) {
      const [ratings] = await pool.query(`
        SELECT u.name AS user_name, r.rating, r.created_at
        FROM ratings r
        JOIN users2 u ON r.user_id = u.id
        WHERE r.store_id = ?
      `, [store.id]);
      store.ratings = ratings;
    }

    res.json(stores);
  } catch (err) {
    console.error("Error fetching owner stores:", err.message);
    res.status(500).json({ error: err.message });
  }
};





const getTotalRatings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM ratings WHERE rating > 0");
    res.json({ total: rows[0].total });
  } catch (error) {
    console.error("Error fetching total ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getUserRatings = async (req, res) => {
  try {
    const userId = req.params.id;
    const [results] = await pool.query(
      'SELECT store_id, rating FROM ratings WHERE user_id = ?',
      [userId]
    );
    res.json(results); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
};



const stores = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        u.name AS owner_name,
        IFNULL(AVG(r.rating), 0) AS rating  -- calculate average rating
      FROM stores s
      JOIN users2 u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.email, s.address, u.name
    `);

    res.json(results);
  } catch (err) {
    console.error("Error fetching stores:", err.message);
    res.status(500).json({ error: err.message });
  }
};






const Addstore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    
    if (!name || !email || !owner_id) {
      return res.status(400).json({ message: "Name, email, and owner are required" });
    }

    
    const [existing] = await pool.query("SELECT id FROM stores WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Store with this email already exists" });
    }
    const query = `
      INSERT INTO stores (name, email, address, owner_id)
      VALUES (?, ?, ?, ?)
    `;

    await pool.query(query, [name, email, address, owner_id]);

    res.status(201).json({ message: "Store created successfully" });
  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const addOrUpdateRating = async (req, res) => {
  try {
    const { user_id, store_id, rating } = req.body;

    if (!user_id || !store_id || !rating) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [user_id, store_id, rating]
    );

    res.json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const register = async (req, res) => {
  const { name, email, address, password, role } = req.body;

  if (!name || !email || !address || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if email exists
    const [existing] = await pool.query("SELECT * FROM users2 WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Insert user
    await pool.query(
      "INSERT INTO users2 (name, email, address, password, role) VALUES (?,?,?,?,?)",
      [name, email, address, password, role]
    );

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users2 WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    return res.status(200).json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};



const updateOwnerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    const [result] = await pool.query(
      "UPDATE users2 SET password = ? WHERE id = ? AND role = 'owner'",
      [newPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

};



const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params; 
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }
    
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!regex.test(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      });
    }
    const [result] = await pool.query(
      "UPDATE users2 SET password = ? WHERE id = ? AND role = 'user'",
      [newPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating user password:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeUserRating = async (req, res) => {
  try {
    const { userId, storeId } = req.params;

    const [result] = await pool.query(
      "DELETE FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Rating not found" });
    }

    res.json({ success: true, message: "Rating removed successfully" });
  } catch (error) {
    console.error("Error removing rating:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = { register, login, users, Addstore, stores, addOrUpdateRating, getUserRatings, getTotalRatings, getOwnerStores, updateOwnerPassword, updateUserPassword,removeUserRating};

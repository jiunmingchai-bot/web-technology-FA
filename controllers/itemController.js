const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool using .env variables [cite: 112]
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise(); // Using promise() for cleaner async/await code

// 1. CREATE: Submit a new report with Server-Side Validation
exports.createItem = async (req, res) => {
    try {
        const { title, description, category, location, item_date, contact_info } = req.body;

        // SERVER-SIDE VALIDATION [Requirement: Security]
        if (!title || !description || !category || !location || !item_date || !contact_info) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Basic Sanitization (preventing simple HTML tags)
        const cleanTitle = title.replace(/<[^>]*>?/gm, ''); 

        // Security: Parameterized query to prevent SQL Injection [Requirement: Security]
        const sql = `INSERT INTO items (title, description, category, location, item_date, contact_info) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        
        await db.execute(sql, [cleanTitle, description, category, location, item_date, contact_info]);
        res.status(201).json({ message: 'Item reported successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while creating report' });
    }
};

// 2. READ: View all items [cite: 60, 61]
exports.getAllItems = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching items' });
    }
};

// 3. READ: View detailed item information [cite: 62]
exports.getItemById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM items WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Item not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching item details' });
    }
};

// 4. UPDATE: Update item status (Active -> Claimed/Resolved) [cite: 63]
exports.updateItem = async (req, res) => {
    try {
        const { status } = req.body;
        const sql = 'UPDATE items SET status = ? WHERE id = ?';
        await db.execute(sql, [status, req.params.id]);
        res.json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating status' });
    }
};

// 5. DELETE: Delete a report [cite: 64]
exports.deleteItem = async (req, res) => {
    try {
        await db.execute('DELETE FROM items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting report' });
    }
};
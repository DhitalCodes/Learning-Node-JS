const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5500;

// ========== CONFIGURATION ==========
const USERS_FILE = path.join(__dirname, "data", "users.json");

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ========== DATA LOADING FUNCTIONS ==========

// Load users from JSON file
function loadUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading users:", error.message);
        return [];
    }
}

// Save users to JSON file
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
        return true;
    } catch (error) {
        console.error("Error saving users:", error.message);
        return false;
    }
}

// Generate new ID (simple increment)
function generateId(users) {
    if (users.length === 0) return "1";
    const maxId = Math.max(...users.map(u => parseInt(u._id) || 0));
    return String(maxId + 1);
}

// ========== API ROUTES ==========

// GET ALL USERS
app.get("/api/users", (req, res) => {
    const users = loadUsers();
    res.status(200).json({
        success: true,
        total: users.length,
        users
    });
});

// GET SINGLE USER BY ID
app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const users = loadUsers();
    const user = users.find(u => u._id === id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    res.status(200).json({
        success: true,
        user
    });
});

// CREATE NEW USER
app.post("/api/users", (req, res) => {
    const { name, email, age } = req.body;
    
    // Validation
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }
    
    const users = loadUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }
    
    const newUser = {
        _id: generateId(users),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: age ? parseInt(age) : null,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    if (saveUsers(users)) {
        res.status(201).json({
            success: true,
            user: newUser,
            message: "User created successfully"
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Failed to save user"
        });
    }
});

// UPDATE USER
app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    
    if (!name && !email && age === undefined) {
        return res.status(400).json({
            success: false,
            message: "At least one field to update is required"
        });
    }
    
    const users = loadUsers();
    const userIndex = users.findIndex(u => u._id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    // Check email uniqueness if updating email
    if (email && users.some((u, i) => i !== userIndex && u.email === email)) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }
    
    // Update fields
    if (name) users[userIndex].name = name.trim();
    if (email) users[userIndex].email = email.trim().toLowerCase();
    if (age !== undefined) users[userIndex].age = parseInt(age) || null;
    
    if (saveUsers(users)) {
        res.status(200).json({
            success: true,
            user: users[userIndex],
            message: "User updated successfully"
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
});

// DELETE USER
app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const users = loadUsers();
    const filteredUsers = users.filter(u => u._id !== id);
    
    if (filteredUsers.length === users.length) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    if (saveUsers(filteredUsers)) {
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
});

// ========== SEARCH USERS ==========
app.get("/api/search", (req, res) => {
    const { q } = req.query;
    const users = loadUsers();
    
    if (!q || q.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Search query is required"
        });
    }
    
    const searchTerm = q.trim().toLowerCase();
    const results = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
    );
    
    res.status(200).json({
        success: true,
        total: results.length,
        users: results
    });
});

// ========== STATS ENDPOINT ==========
app.get("/api/stats", (req, res) => {
    const users = loadUsers();
    
    const stats = {
        totalUsers: users.length,
        averageAge: users.length > 0 
            ? Math.round(users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length)
            : 0,
        ageDistribution: {
            under25: users.filter(u => u.age < 25).length,
            between25And35: users.filter(u => u.age >= 25 && u.age <= 35).length,
            over35: users.filter(u => u.age > 35).length
        }
    };
    
    res.status(200).json({
        success: true,
        stats
    });
});

// ========== SERVE FRONTEND ==========
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Data file: ${USERS_FILE}`);
    const count = loadUsers().length;
    console.log(`👥 ${count} users loaded`);
});

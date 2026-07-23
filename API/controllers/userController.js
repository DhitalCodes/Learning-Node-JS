const users = require("../data/users");

// GET ALL USERS
const getAllUsers = (req, res) => {
    res.status(200).json({
        success: true,
        total: users.length,
        users
    });
};

// GET SINGLE USER BY ID (string based)
const getSingleUser = (req, res) => {
    const { id } = req.params;
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
};

module.exports = { getAllUsers, getSingleUser };
const express = require("express");
const router = express.Router();
const { getAllUsers, getSingleUser } = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);

module.exports = router;
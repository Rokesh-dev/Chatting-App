const express = require("express");
const { addUser, editUser } = require("./admin");
const { auth } = require("../../middleware");

const router = express.Router();

router.post("/add-user", auth, addUser);
router.post("/edit-user", auth, editUser);

module.exports = router;

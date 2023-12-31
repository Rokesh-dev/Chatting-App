const express = require("express");
const { userLogin, addUser, userSearch } = require("./users");
const { auth } = require("../../middleware");

const router = express.Router();

// router.route("/").post(userRegistration).get(protect, userSearch); // Both request supported on the same route
router.post("/login", userLogin);
router.get("/search", auth, userSearch);

module.exports = router;

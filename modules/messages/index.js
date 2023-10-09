const express = require("express");
const {
  sendText,
  viewTexts,
} = require("./messages");

const { auth } = require("../../middleware");

const router = express.Router();

// router.route("/").post(protect, sendMessage);
// router.route("/:chatId").get(protect, allMessages); // Fetch all messages for a single chat

router.post("/", auth, sendText);
router.get("/:chatId", auth, viewTexts);

module.exports = router;

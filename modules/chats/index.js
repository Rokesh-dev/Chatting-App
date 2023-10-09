const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("./chats");
const { auth } = require("../../middleware");

const router = express.Router();

// Only logged in user can access the below routes
router.route("/").post(auth, accessChat).get(auth, fetchChats); // Both requests work on same route
router.route("/group").post(auth, createGroupChat); // Create group chat
router.route("/rename").put(auth, renameGroup); // Rename group chat
router.route("/groupadd").put(auth, addToGroup); // Add someone to the group
router.route("/groupremove").put(auth, removeFromGroup); // Remove someone or leave the group

module.exports = router;

const express = require("express");
const router = express.Router();
const { validateAuth } = require("../../validation/validation");
const userController = require("../../controllers/users");
const guard = require("../../services/guard");

router.post("/signup", validateAuth, userController.signup);
router.post("/login", validateAuth, userController.login);
router.post("/logout", guard, userController.logout);
router.get("/current", guard, userController.currentUser);

module.exports = router;

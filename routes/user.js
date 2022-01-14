const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authToken } = require("../middleware/checkAuth");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/register", UserController.signUpController);
router.post("/login", UserController.loginController);
router.get("/:userId", authToken, UserController.getUserByIdController);

module.exports = router;

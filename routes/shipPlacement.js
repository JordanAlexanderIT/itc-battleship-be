const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/checkAuth");
const {
  shipPlacementRandomController,
} = require("../controllers/shipPlacementController.js");

router.post("/random", authToken, shipPlacementRandomController);

module.exports = router;

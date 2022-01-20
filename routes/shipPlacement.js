const express = require("express");
const router = express.Router({ mergeParams: true });
const { authToken } = require("../middleware/checkAuth");
const {
  shipPlacementRandomController,
  shipPlacementController,
} = require("../controllers/shipPlacementController.js");

router.post("/random", authToken, shipPlacementRandomController);
router.post("/", authToken, shipPlacementController);

module.exports = router;

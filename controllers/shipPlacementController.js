async function shipPlacementRandomController(req, res) {
  const userId = req.body.userId;

  return res
    .status(200)
    .json(
      "To be implemented. Will return the player field with ships randomly placed"
    );
}

module.exports = {
  shipPlacementRandomController,
};

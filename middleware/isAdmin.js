const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

exports.isAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (decoded.userRole === "ADMIN") {
      next();
    } else {
      res
        .status(401)
        .json({ message: "This token is not an Administrator token." });
      return;
    }
  } catch (err) {
    res.status(401).json({ message: "This token is invalid." });
    return;
  }
};

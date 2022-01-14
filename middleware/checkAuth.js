const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

exports.authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token: ", token);
  if (token == null)
    return res
      .sendStatus(401)
      .json({ message: "This request was unauthorized, a token is required." });
  jwt.verify(token, JWT_SECRET_KEY, (err, tokenInfo) => {
    if (err) {
      console.log("Auth error: ", err);
      res.status(403).send("Invalid Token");
      return;
    } else {
      console.log("User ID: ", tokenInfo.userId);
      req.body.userId = tokenInfo.userId;
      req.body.userRole = tokenInfo.userRole;
      next();
    }
  });
};

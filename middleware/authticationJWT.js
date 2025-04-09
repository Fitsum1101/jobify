
const jwt = require("jsonwebtoken");

exports.authticatioToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "access denied.no token proided" });
  }
  jwt.verify(token, "mysecretkey", (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

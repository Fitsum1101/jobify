exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role || req.user.role === "SUPER_ADMIN") {
      return next();
    }
    res.status(403).json({
      msg: "Access denied. Insufficient permissons",
    });
  };
};

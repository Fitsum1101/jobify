exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }
    if (
      role !== "SUPER_ADMIN" &&
      (req.user.role === role || req.user.role === "ADMIN")
    ) {
      return next();
    }
    res.status(403).json({
      msg: "Access denied. Insufficient permissons",
    });
  };
};

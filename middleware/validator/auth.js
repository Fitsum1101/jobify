const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(403).json({
      error: result.array(),
    });
  }
  next();
};

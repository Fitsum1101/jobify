const db = require("../config/db");
const JWT = require("jsonwebtoken");

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  res.status(200).json({
    email,
    password,
  });
};

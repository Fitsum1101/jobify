const db = require("../config/db");
const JWT = require("jsonwebtoken");

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      username: true,
      email: true,
      id: true,
    },
  });
  const token = JWT.sign(user, "mysecretkey", { expiresIn: "1h" });
  return res.status(200).json({
    msg: "login successifly🌼",
    token,
  });
};

const db = require("../config/db");

//  check if the comapney belongs to the admin that login
module.exports = async (req, res, next) => {
  const id = +req.params.id;
  const comaney = await db.companey.findOne({
    where: {
      id,
    },
    select: {
      admin_id,
    },
  });

  if (comaney.admin_id !== req.user.id) {
    return res.status(401).json({
      msg: "not allowed ",
    });
  }
  next();
};

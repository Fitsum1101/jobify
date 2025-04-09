const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.postAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const adminExist = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (adminExist) {
      return res.status(403).json({
        msg: "email aiready in use!!",
      });
    }
    const bcryptPassword = await bcrypt.hash(password, 12);
    const newAdmin = await db.user.create({
      data: {
        username,
        email,
        password: bcryptPassword,
        role: "ADMIN",
      },
    });
    return res.status(201).json({ newAdmin });
  } catch (error) {
    next(error);
  }
};

exports.patchEditAdmin = async (req, res, next) => {
  const id = +req.params.id;
  const { email, username, password } = req.body;
  const adminExist = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!adminExist) {
    return res.status(404).json({
      msg: "Admin does't exists",
    });
  }
  const adminEmailExists = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (adminEmailExists) {
    return res.status(403).json({
      msg: "email aiready in use!!",
    });
  }
  const passwordHased = await bcrypt.hash(password, 12);
  const updatedAdmin = await db.user.update({
    where: {
      id,
    },
    data: {
      email,
      username,
      password: passwordHased,
    },
  });

  return res.status(200).json({
    updatedAdmin,
  });
};

exports.deleteAdimn = async (req, res, next) => {
  try {
    const id = req.body.id;
    const adminExists = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!adminExists) {
      return res.status(404).json({
        msg: "does't exists!",
      });
    }
    const deletedAdmin = await db.user.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      deletedAdmin,
    });
  } catch (error) {
    next(error);
  }
};

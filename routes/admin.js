const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../config/db");

const router = express.Router();

router.post("/admin", async (req, res, next) => {
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
      },
    });
    return res.status(201).json({ newAdmin });
  } catch (error) {
    next(error);
  }
});

router.delete("/admin", async (req, res, next) => {
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
});

module.exports = router;

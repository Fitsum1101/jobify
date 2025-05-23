const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");

const authController = require("../controllers/Auth");
const db = require("../config/db");
const authValidotr = require("../middleware/validator/auth");

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Invalid email")
      .normalizeEmail()
      .custom(async (value) => {
        const isEmailExists = await db.user.findUnique({
          where: {
            email: value,
          },
        });

        if (!isEmailExists) {
          return Promise.reject("please insert valid email");
        }
      }),
    body("password")
      .trim()
      .isLength({ min: 5, max: 7 })
      .withMessage("Password needs to be between 5 and 7")
      .custom(async (value, { req }) => {
        const email = req.body.email;
        const hash = await db.user.findUnique({
          select: {
            password: true,
          },
          where: {
            email,
          },
        });
        const hashPassword = hash.password;
        if (!(await bcrypt.compare(value, hashPassword))) {
          return Promise.reject("password does't match");
        }
      }),
  ],
  authValidotr,
  authController.postLogin
);

router.post(
  "/signin",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Invalid username")
      .custom(async (username, { req }) => {
        const isUserNameEist = await db.user.findUnique({
          where: {
            username,
          },
        });
        if (isUserNameEist) {
          return Promise.reject("username aleady exists");
        }
      }),
    body("password")
      .trim()
      .isLength({ min: 5, max: 7 })
      .withMessage("Password needs to be between 5 and 7"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Invalid email")
      .normalizeEmail()
      .custom(async (email) => {
        const isEmailExists = await db.user.findUnique({
          where: {
            email,
          },
        });
        if (isEmailExists) {
          return Promise.reject("Email aleady in use");
        }
      }),
  ],
  authController.postSignup
);

module.exports = router;

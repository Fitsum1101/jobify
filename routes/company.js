const express = require("express");
const multer = require("multer");

const db = require("../config/db");
const imageDelete = require("../util/file");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.post("/company", upload.single("file"), async (req, res, next) => {
  try {
    const name = req.body.name;
    const file = req.file;

    const nameExist = await db.companey.findUnique({
      where: {
        name,
      },
    });
    if (nameExist) {
      return res.status(403).json({
        msg: "name aleady exists",
      });
    }
    const newCompany = await db.companey.create({
      data: {
        logo: file.path,
        name,
      },
    });
    return res.status(403).json({ newCompany });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/company/delete/:id", async (req, res, next) => {
  const id = +req.params.id;
  const companeyExist = await db.companey.findFirst({
    where: {
      id,
    },
  });
  if (!companeyExist) {
    return res.status(404).json({
      message: "companey does not exists",
    });
  }
  const companeyDeleted = await db.companey.delete({
    where: {
      id,
    },
  });
  await imageDelete(companeyExist.logo);
  return res.status(200).json({ companeyDeleted });
});

module.exports = router;

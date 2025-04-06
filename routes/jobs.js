const express = require("express");
const multer = require("multer");

const db = require("../config/db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(null, false);
  }
  cb(null, true);
};

const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.post(
  "/company/:name/jobs",
  uploadPdf.single("pdf"),
  async (req, res) => {
    try {
      const companeyName = req.params.name;
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

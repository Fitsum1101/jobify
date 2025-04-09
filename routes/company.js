const express = require("express");
const multer = require("multer");

const companyController = require("../controllers/company");

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

router.get("/company", companyController.getCompany);

router.get("/company/search", companyController.searchCompany);

router.post("/company", upload.single("file"), companyController.postCompany);

router.delete("/company/delete/:id", companyController.deleteCompany);

router.patch(
  "/company/edit/:id",
  upload.single("file"),
  companyController.editCompany
);

module.exports = router;

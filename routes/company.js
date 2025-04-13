const express = require("express");
const multer = require("multer");

const companyController = require("../controllers/company");
const authtication = require("../middleware/authticationJWT");
const authorize = require("../middleware/permission");
const adminCompany = require("../middleware/Admincompany");

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

router.get(
  "/company",
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  companyController.getCompany
);

router.get(
  "/company/search",
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  companyController.searchCompany
);

router.post(
  "/company",
  upload.single("file"),
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  companyController.postCompany
);

router.delete(
  "/company/delete/:id",
  authtication.authticatioToken,
  adminCompany(),
  authorize.authorizeRole("ADMIN"),
  companyController.deleteCompany
);

router.patch(
  "/company/edit/:id",
  upload.single("file"),
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  adminCompany(),
  companyController.editCompany
);

module.exports = router;

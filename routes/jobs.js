const express = require("express");
const multer = require("multer");

const jobContollers = require("../controllers/jobs");
const authtication = require("../middleware/authticationJWT");
const authorize = require("../middleware/permission");

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
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  jobContollers.postJobs
);

router.patch(
  "/company/:name/jobs/edit/:id",
  uploadPdf.single("pdf"),
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  jobContollers.editCompanyJobs
);

router.delete(
  "/company/:name/jobs/delete/:id",
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  jobContollers.deleteCompanyJobs
);

// filter by using jobtitle,salary and location
router.get(
  "/company/jobs/",
  authtication.authticatioToken,
  authorize.authorizeRole("ADMIN"),
  jobContollers.getCompanyJobs
);

module.exports = router;

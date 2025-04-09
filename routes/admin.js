const express = require("express");

const adminCotroller = require("../controllers/admin");

const authtication = require("../middleware/authticationJWT");

const router = express.Router();

router.post("/admin", authtication.authticatioToken, adminCotroller.postAdmin);

router.patch(
  "/admin/edit/:id",
  authtication.authticatioToken,
  adminCotroller.patchEditAdmin
);

router.delete(
  "/admin",
  authtication.authticatioToken,
  adminCotroller.deleteAdimn
);

module.exports = router;

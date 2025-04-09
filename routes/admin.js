const express = require("express");

const adminCotroller = require("../controllers/admin");

const authtication = require("../middleware/authticationJWT");
const authorize = require("../middleware/permission");


const router = express.Router();

router.post(
  "/admin",
  authtication.authticatioToken,
  authorize.authorizeRole("SUPER_ADMIN"),
  adminCotroller.postAdmin
);

router.patch(
  "/admin/edit/:id",
  authtication.authticatioToken,
  authorize.authorizeRole("SUPER_ADMIN"),
  adminCotroller.patchEditAdmin
);

router.delete(
  "/admin",
  authtication.authticatioToken,
  authorize.authorizeRole("SUPER_ADMIN"),
  adminCotroller.deleteAdimn
);

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");

const adminCotroller = require("../controllers/admin");

const router = express.Router();

router.post("/admin", adminCotroller.postAdmin);

router.patch("/admin/edit/:id", adminCotroller.patchEditAdmin);

router.delete("/admin", adminCotroller.deleteAdimn);

module.exports = router;

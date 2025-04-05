const express = require("express");


const router = express.Router();

router.post("/admin", async (req, res, next) => {
  const { userName, email, password, role } = req.body;
});

module.exports =  router;

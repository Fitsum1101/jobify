const express = require("express");

const db = require("../config/db");

const router = express.Router();

router.post("/company/:name/jobs", async (req, res, next) => {
  try {
    const companeyName = req.params.name;
  } catch (error) {
    
  }
});

module.exports = router;

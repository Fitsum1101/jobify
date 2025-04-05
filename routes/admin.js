import express from "express";

// import db from "../config/db.js";


const router = express.Router();

router.post("/admin", async (req, res, next) => {
  const { userName, email, password, role } = req.body;
});

export default router;

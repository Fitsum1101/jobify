const express = require("express");
const multer = require("multer");

const db = require("../config/db");
// const 

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
      const jobData = { ...req.body };
      const pdfFile = req.file;
      const companyExist = await db.companey.findFirst({
        where: {
          name: companeyName,
        },
      });
      if (!companyExist) {
        return res.status(404).json({
          msg: "not Founded",
        });
      }
      if (pdfFile) {
        jobData["descFile"] = req.file.path;
      }

      const questionData = `Write me job description for this java script object data that it have all data you need for generating the description info ${jobData} `;



    } catch (error) {
      next(error);
    }
  }
);

// router.patch(
//   "/company/:name/jobs/edit/:id",
//   uploadPdf.single("pdf"),
//   async (req, res, next) => {
//     const companeyName = req.params.name;
//     const datas = { ...req.body };
//     const file = req.file;
//     if (file) {
//       //  update the file that exists
//     }
//     const jobExists = await db.job.findUnique({
//       where: {
//         title: companeyName,
//       },
//     });
//   }
// );

module.exports = router;

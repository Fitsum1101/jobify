const express = require("express");
const multer = require("multer");

const db = require("../config/db");
const ai = require("../config/ai");
const { Jobtype } = require("@prisma/client");

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
  async (req, res, next) => {
    try {
      const companeyName = req.params.name;
      const jobData = { ...req.body };
      const pdfFile = req.file;
      const companyExist = await db.companey.findUnique({
        where: {
          name: companeyName,
        },
      });
      if (!companyExist) {
        return res.status(404).json({
          msg: "Not Founded",
        });
      }
      const questionData = `I don't want any talk just give me descrption for my job which have title of ${jobData.title} ,requirement ${jobData.requirments} ,salary ${jobData.salary} ,location ${jobData.location} and  job working time ${jobData.jobtype} make it mideum size(less than < 191) !!!! `;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: questionData,
      });
      jobData["description"] = response.candidates[0].content.parts[0].text;
      if (pdfFile) {
        jobData["descFile"] = req.file.path;
      }
      const jobInfo = await db.job.create({
        data: {
          ...{ ...jobData, companey_id: companyExist.id },
        },
      });
      res.status(201).json({
        jobInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/company/:name/jobs/edit/:id",
  uploadPdf.single("pdf"),
  async (req, res, next) => {
    const companeyName = req.params.name;
    const id = +req.params.id;
    const jobData = { ...req.body };
    const pdfFile = req.file;
    const companyExist = await db.companey.findUnique({
      where: {
        name: companeyName,
      },
    });
    const jobExis = await db.job.findUnique({
      where: {
        id,
      },
    });
    if (!companyExist || !jobExis) {
      return res.status(404).json({
        msg: "Not Founded",
      });
    }
    if (pdfFile) {
      jobData["descFile"] = req.file.path;
    } else {
      jobData["descFile"] = jobExis.descFile;
    }
    const questionData = `I don't want any talk just give me descrption for my job which have title of ${jobData.title} ,requirement ${jobData.requirments} ,salary ${jobData.salary} ,location ${jobData.location} and  job working time ${jobData.jobtype} make it mideum size(less than < 191) !!!! `;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: questionData,
    });
    jobData["description"] = response.candidates[0].content.parts[0].text;
    const updatedJob = await db.job.update({
      where: {
        id,
      },
      data: {
        ...jobData,
      },
    });
    res.status(200).json({
      updatedJob,
    });
  }
);

router.delete("/company/:name/jobs/delete/:id", async (req, res, next) => {
  const id = +req.params.id;
  const deletedJob = await db.job.delete({
    where: {
      id,
    },
  });
  res.status(200).json(deletedJob);
});

// filter by using jobtitle,salary and location
router.get("/company/jobs/", async (req, res, next) => {
  const { title, salary, location } = req.query;
  console.log(title, salary, location);
  let filterMethod = {};
  if (title) {
    filterMethod = { title };
  }
  if (salary) {
    filterMethod = { salary: +salary };
  }
  if (location) {
    filterMethod = { location };
  }
  const jobs = await db.job.findMany({
    where: { ...filterMethod },
  });
  res.status(200).json(jobs);
});

module.exports = router;

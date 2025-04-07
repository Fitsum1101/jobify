const express = require("express");
const bodyParser = require("body-parser");

const admiRoute = require("./routes/admin");
const companyRoute = require("./routes/company");
const jobsRoute = require("./routes/jobs");
const openAi = require("./config/ai");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// amazing project
app.use(admiRoute);
app.use(companyRoute);
app.use(jobsRoute);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
app.listen(3000);

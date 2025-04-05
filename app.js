const express = require("express");
const bodyParser = require("body-parser");

const admiRoute = require("./routes/admin");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(admiRoute);

app.listen(3000);

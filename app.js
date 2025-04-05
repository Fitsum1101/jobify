const express = require("express");

const admiRoute = require("./routes/admin");

const { PrismaClient } = require("@prisma/client");

const app = express();

app.use(admiRoute);

app.listen(3000);

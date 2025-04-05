import express from "express";

import admiRoute from "./routes/admin.js";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(admiRoute);

app.listen(3000);

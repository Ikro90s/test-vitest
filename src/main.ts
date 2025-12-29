import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ReportController } from "./http/ReportController";

const app = express();
const port = process.env.APP_PORT || 3000;

app.get("/relatorio/:n", ReportController.handle);

app.listen(port, () => {
    console.log(`[SERVER] Rodando em http://localhost:${port}`);
    console.log(`[ENV] Ambiente: ${process.env.APP_ENV}`);
});

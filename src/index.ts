import express from "express";
import { container } from "./inversify.config";
import { TYPES } from "./types/types";
import { IReportGenerator, IEmailService, ILogger } from "./interfaces/interfaces";

const app = express();
const port = 3000;

app.get("/report", (req, res) => {

    const reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    const emailService = container.get<IEmailService>(TYPES.IEmailService);
    const logger = container.get<ILogger>(TYPES.ILogger);

    logger.log("Requisição recebida para gerar relatório.");

    const report = reportGenerator.generate();
    emailService.send("estudante@ufr.br", "Relatório Diário", report);

    res.send({
        message: "Relatório gerado e enviado!",
        content: report,
        env: process.env.NODE_ENV || "development"
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
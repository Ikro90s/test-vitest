import { Request, Response } from "express";
import { container } from "../config/container";
import { TYPES } from "../config/types";
import { IReportService } from "../domain/interfaces";
import { InvalidReportSizeError } from "../domain/errors/InvalidReportSizeError";

export class ReportController {
    static async handle(req: Request, res: Response) {
        const n = parseInt(req.params.n) || 0;
        const email = req.query.email as string;

        if (!email) {
            return res.status(400).send({ error: "E-mail é obrigatório." });
        }

        try {
            const reportService = container.get<IReportService>(TYPES.ReportService);
            
            await reportService.generateAndSend(email, n);
            
            res.status(200).send({ message: "Relatório gerado e enviado com sucesso!" });
        } catch (error) {
            if (error instanceof InvalidReportSizeError) {
                return res.status(400).send({ error: error.message });
            }

            console.error(error);
            res.status(500).send({ error: "Erro interno no servidor." });
        }
    }
}

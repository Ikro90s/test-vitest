import { injectable, inject } from "inversify";
import { IReportGenerator, ILogger } from "../interfaces/interfaces";
import { TYPES } from "../types/types";

@injectable()
export class ReportGenerator implements IReportGenerator {
    private logger: ILogger;

    constructor(@inject(TYPES.ILogger) logger: ILogger) {
        this.logger = logger;
    }

    generate(): string {
        this.logger.log("Gerando relatório de dados fictícios...");
        const data = ["Vendas: R$ 1000", "Novos Clientes: 5", "Visitas: 150"];
        return `Relatório do dia ${new Date().toLocaleDateString()}:\n${data.join(" ")}`;
    }
}
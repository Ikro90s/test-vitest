import { injectable, inject } from "inversify";
import { faker } from "@faker-js/faker";
import { IReportService, ILogger, IMailer } from "../interfaces";
import { InvalidReportSizeError } from "../errors/InvalidReportSizeError";
import { TYPES } from "../../config/types";

@injectable()
export class ReportService implements IReportService {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Mailer) private mailer: IMailer
    ) {}

    async generateAndSend(email: string, n: number): Promise<void> {
        if (n <= 0 || n > 10) {
            throw new InvalidReportSizeError();
        }

        this.logger.info(`Iniciando geração de relatório com ${n} registros.`);

        const data = Array.from({ length: n }, () => ({
            nome: faker.person.fullName(),
            cidade: faker.location.city(),
        }));

        const reportBody = `Relatório de Dados Fictícios:\n\n` + 
            data.map(d => `- Nome: ${d.nome}, Cidade: ${d.cidade}`).join("\n");

        await this.mailer.send(email, "Seu Relatório Acadêmico", reportBody);

        this.logger.info(`Relatório enviado com sucesso para ${email}.`);
    }
}

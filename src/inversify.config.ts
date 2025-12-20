import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types/types";
import { ILogger, IEmailService, IReportGenerator } from "./interfaces/interfaces";
import { DevLogger, ProdLogger } from "./infrastructure/logger";
import { DevEmailService, ProdEmailService } from "./infrastructure/email";
import { ReportGenerator } from "./services/report";

const container = new Container();

// Lógica de ambiente
const isProd = process.env.NODE_ENV === "production";

// Bindings dependendo do ambiente
if (isProd) {
    container.bind<ILogger>(TYPES.ILogger).to(ProdLogger);
    container.bind<IEmailService>(TYPES.IEmailService).to(ProdEmailService);
} else {
    container.bind<ILogger>(TYPES.ILogger).to(DevLogger);
    container.bind<IEmailService>(TYPES.IEmailService).to(DevEmailService);
}

// O gerador de relatório é o mesmo para ambos
container.bind<IReportGenerator>(TYPES.IReportGenerator).to(ReportGenerator);

export { container };
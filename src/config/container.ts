import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { ILogger, IMailer, IReportService } from "../domain/interfaces";
import { WinstonLogger } from "../infra/logger/WinstonLogger";
import { NodemailerMailer } from "../infra/mailer/NodemailerMailer";
import { ReportService } from "../domain/services/ReportService";

const container = new Container();

container.bind<ILogger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();
container.bind<IMailer>(TYPES.Mailer).to(NodemailerMailer).inSingletonScope();

container.bind<IReportService>(TYPES.ReportService).to(ReportService);

export { container };

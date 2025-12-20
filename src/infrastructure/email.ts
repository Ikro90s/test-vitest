import { injectable } from "inversify";
import { IEmailService } from "../interfaces/interfaces";

@injectable()
export class DevEmailService implements IEmailService {
    send(to: string, subject: string, body: string): void {
        console.log(`[DEV EMAIL]: Simulação de envio para ${to}. Assunto: ${subject}`);
    }
}

@injectable()
export class ProdEmailService implements IEmailService {
    send(to: string, subject: string, body: string): void {
        console.log(`[PROD EMAIL]: Enviando e-mail REAL para ${to}...`);
    }
}
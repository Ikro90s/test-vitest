export interface ILogger {
    log(message: string): void;
}

export interface IEmailService {
    send(to: string, subject: string, body: string): void;
}

export interface IReportGenerator {
    generate(): string;
}
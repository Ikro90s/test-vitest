import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportService } from './services/ReportService';
import { ILogger, IMailer } from './interfaces';
import { InvalidReportSizeError } from './errors/InvalidReportSizeError';

describe('ReportService', () => {
    let reportService: ReportService;
    let loggerMock: ILogger;
    let mailerMock: IMailer;

    beforeEach(() => {
        loggerMock = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as ILogger;
        
        mailerMock = {
            send: vi.fn().mockResolvedValue(undefined),
        } as unknown as IMailer;
        
        reportService = new ReportService(loggerMock, mailerMock);
    });

    it('deve lançar InvalidReportSizeError se n for menor ou igual a 0', async () => {
        await expect(reportService.generateAndSend('test@example.com', -5))
            .rejects.toThrow(InvalidReportSizeError);
    });

    it('deve lançar InvalidReportSizeError se n for maior que 10', async () => {
        await expect(reportService.generateAndSend('test@example.com', 15))
            .rejects.toThrow(InvalidReportSizeError);
    });

    it('deve gerar o relatório e enviar e-mail com sucesso para valores válidos', async () => {
        const email = 'test@example.com';
        const n = 5;

        await reportService.generateAndSend(email, n);

        expect(mailerMock.send).toHaveBeenCalledWith(
            email,
            "Seu Relatório Acadêmico",
            expect.stringContaining("Relatório de Dados Fictícios:")
        );
        expect(loggerMock.info).toHaveBeenCalled();
    });
});

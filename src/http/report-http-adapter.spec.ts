import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReportController } from './ReportController';
import { container } from '../config/container';
import { TYPES } from '../config/types';
import { InvalidReportSizeError } from '../domain/errors/InvalidReportSizeError';
import { Request, Response } from 'express';

describe('ReportController (HttpAdapter)', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let reportServiceMock: any;

    beforeEach(() => {
        container.snapshot();
        
        reportServiceMock = {
            generateAndSend: vi.fn(),
        };

        container.rebind(TYPES.ReportService).toConstantValue(reportServiceMock);

        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        container.restore();
    });

    it('deve responder com status 400 se o email não for fornecido', async () => {
        req = {
            params: { n: '5' },
            query: {},
        };

        await ReportController.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: "E-mail é obrigatório." });
    });

    it('deve responder com status 400 se o ReportService lançar InvalidReportSizeError', async () => {
        req = {
            params: { n: '15' },
            query: { email: 'test@example.com' },
        };
        reportServiceMock.generateAndSend.mockRejectedValue(new InvalidReportSizeError());

        await ReportController.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: expect.stringContaining("inválido") });
    });

    it('deve responder com status 500 se o ReportService lançar um erro genérico', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        req = {
            params: { n: '5' },
            query: { email: 'test@example.com' },
        };
        reportServiceMock.generateAndSend.mockRejectedValue(new Error("Database down"));

        await ReportController.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: "Erro interno no servidor." });
        
        consoleSpy.mockRestore();
    });
});

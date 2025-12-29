import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { IMailer } from "../../domain/interfaces";

@injectable()
export class NodemailerMailer implements IMailer {
    private transporter: nodemailer.Transporter | null = null;

    private async getTransporter(): Promise<nodemailer.Transporter> {
        if (this.transporter) return this.transporter;

        const isProd = process.env.APP_ENV === "prod";

        if (isProd) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }
        return this.transporter;
    }

    async send(to: string, subject: string, body: string): Promise<void> {
        const transporter = await this.getTransporter();
        const info = await transporter.sendMail({
            from: '"Sistema Acadêmico" <noreply@ufr.br>',
            to,
            subject,
            text: body,
        });

        if (process.env.APP_ENV !== "prod") {
            console.log(`[DEV MAIL] URL para visualização: ${nodemailer.getTestMessageUrl(info)}`);
        }
    }
}

import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendaMailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then( account => {
            // Create a SMTP transporter object
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                // secure: account.smtp.secure,
                secure: false, // use SSL
                auth: {
                    user: account.user,
                    pass: account.pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            this.client = transporter;
        });
    }

    async execute(to: string, subject: string, variable: object, path: string) {
        const templateFileContent = fs.readFileSync(path).toString("utf8");
        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variable);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br>"
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendaMailService();
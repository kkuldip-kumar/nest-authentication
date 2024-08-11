import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailData } from './dto/email.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserWelcome(data: EmailData) {
    const confirmation_url = `example.com/auth/confirm?token=${data.token}`;

    await this.mailerService.sendMail({
      to: data.user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './welcome',
      context: {
        name: data.user.name,
        confirmation_url,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `https://your-app.com/reset-password?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './password-reset',
        context: {
          resetUrl,
        },
      });
      console.log('email', token);
    } catch (error) {
      throw error;
    }
  }
}

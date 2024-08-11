import { Injectable } from '@nestjs/common';
import { EmailEvent } from '../events/email.event';
import { MailService } from 'src/mail/mail.service';
import { OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class EmailService {
  constructor(
    private mailService: MailService
  ) { }
  getHello() {
    console.log('email service');
    return 'hello email service'
  }
  @OnEvent('welcome.email')
  async notifyUser(payload: EmailEvent) {
    this.mailService.sendUserWelcome(payload.data)
    console.log(`Hello user, has been added Enjoy.`, payload)
  }
  @OnEvent('reset.password')
  async resetUserPassword(payload: EmailEvent) {
    this.mailService.sendPasswordResetEmail(payload.data.user.email, payload.data.token)
    console.log(`reset password !`, payload)
  }

}

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
    console.log(`Hello user, has been added Enjoy.`, payload)
    this.mailService.sendUserWelcome(payload.data)
  }
  @OnEvent('reset.password')
  async resetUserPassword(payload: EmailEvent) {
    console.log(`reset password !`, payload)
    this.mailService.sendPasswordResetEmail(payload.data.user.email, payload.data.token)
  }

}

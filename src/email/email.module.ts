import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailService } from '@/mail/mail.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MailModule
  ],
  controllers: [EmailController],
  providers: [EmailService, MailService],
})
export class EmailModule { }

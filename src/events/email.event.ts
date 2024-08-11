import { EmailData } from "src/mail/dto/email.dto";

export class EmailEvent {
    constructor(public data: EmailData) { }
}
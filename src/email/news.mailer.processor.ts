import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';

@Processor('news-mailer')
export class NewsMailerProcessor {
  constructor(private sendMailer: MailerService) {}
  @Process('sendmail')
  async sendMail(job: Job<ISendMailOptions>) {
    const { subject, to, html, from, text } = job.data;
    await this.sendMailer.sendMail({
      subject,
      to,
      from,
      html,
      text,
    });
  }
}

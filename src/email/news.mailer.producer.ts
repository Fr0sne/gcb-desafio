import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';
// html: `<h3>Welcome, ${result.name} ${result.lastName}!</h3>
// Your account is ready to use!
@Injectable()
class NewsMailerProducer {
  constructor(@InjectQueue('news-mailer') private audioQueue: Queue) {}

  async addNewNoticeEmailQueue(data: ISendMailOptions) {
    await this.audioQueue.add('sendmail', {
      to: data.to,
      subject: data.subject,
      html: data.html,
      from: 'Desafio GCB - News <desafio@gcb.com>',
    });
  }
}
export { NewsMailerProducer };

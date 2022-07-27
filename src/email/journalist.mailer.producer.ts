import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';
// html: `<h3>Welcome, ${result.name} ${result.lastName}!</h3>
// Your account is ready to use!
@Injectable()
class JournalistMailerProducer {
  constructor(@InjectQueue('journalist-mailer') private audioQueue: Queue) {}
  async addNewAccountEmailQueue(data: ISendMailOptions) {
    await this.audioQueue.add('sendmail', {
      to: data.to,
      html: data.html,
      subject: 'Welcome!',
      from: 'Desafio GCB - Welcome <desafio@gcb.com>',
    });
  }
}
export { JournalistMailerProducer };

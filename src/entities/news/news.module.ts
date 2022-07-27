import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsMailerProducer } from 'src/email/news.mailer.producer';
import { NewsMailerProcessor } from 'src/email/news.mailer.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [NewsController],
  providers: [NewsService, NewsMailerProducer, NewsMailerProcessor],
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'news-mailer',
    }),
  ],
})
export class NewsModule {}

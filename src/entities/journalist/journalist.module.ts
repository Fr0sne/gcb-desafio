import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JournalistController } from './journalist.controller';
import { JournalistService } from './journalist.service';
import { BullModule } from '@nestjs/bull';
import { JournalistMailerProcessor } from 'src/email/journalist.mailer.processor';
import { JournalistMailerProducer } from 'src/email/journalist.mailer.producer';

@Module({
  controllers: [JournalistController],
  imports: [
    BullModule.registerQueue({
      name: 'journalist-mailer',
    }),
    DatabaseModule,
  ],
  providers: [
    JournalistService,
    JournalistMailerProcessor,
    JournalistMailerProducer,
  ],
})
export class JournalistModule {}

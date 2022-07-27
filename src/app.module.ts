import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { JournalistModule } from './entities/journalist/journalist.module';
import { NewsModule } from './entities/news/news.module';
import { TypesModule } from './entities/type/types.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'redis_pass',
      },
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JournalistModule,
    NewsModule,
    TypesModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'journalist',
            module: JournalistModule,
          },
          {
            path: 'news',
            module: NewsModule,
          },
          {
            path: 'type',
            module: TypesModule,
          },
        ],
      },
    ]),
  ],
  exports: [BullModule],
})
export class AppModule {}

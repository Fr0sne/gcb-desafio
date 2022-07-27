import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { NewsMailerProducer } from 'src/email/news.mailer.producer';

interface CreateNews {
  id?: string;
  journalistId?: string;
  newsTypeId?: string;
  title: string;
  description?: string;
  body?: string;
  image?: string;
}

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private mailerQueue: NewsMailerProducer,
  ) {}
  async create({
    body,
    description,
    journalistId,
    newsTypeId,
    image,
    title,
  }: CreateNews): Promise<any> {
    try {
      const result = await this.prisma.news.create({
        data: {
          body,
          description,
          title,
          image,
          journalistId,
          newsTypeId,
        },
        include: {
          journalist: true,
        },
      });
      delete result.journalist.password;
      this.mailerQueue.addNewNoticeEmailQueue({
        to: result.journalist.email,
        subject: `News from ${result.journalist.name}`,
        from: 'Desafio GCB - News <desafio@gcb.com>',
        html: `<h2>${result.title}</h2>\n
      <h4>${result.description}</h4>\n
      <img src="${result.image}" />\n
      <p>${result.body}</p>
      `,
      });

      return result;
    } catch (e) {
      throw new HttpException(
        'Make sure that news type exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async update(
    id: string,
    { body, description, newsTypeId, title, image }: CreateNews,
  ) {
    try {
      return await this.prisma.news.update({
        where: {
          id,
        },
        data: {
          body,
          description,
          newsTypeId,
          title,
          image,
        },
      });
    } catch (e) {
      throw new HttpException('No News found with this id.', 404);
    }
  }
  async delete(id: string) {
    try {
      return await this.prisma.news.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new HttpException(
        'No News found with this id.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async listNews(journalistId: string) {
    try {
      return await this.prisma.news.findMany({
        where: {
          journalistId,
        },
      });
    } catch (e) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }

  async listNewsByTypeId(journalistId: string, typeId: string) {
    try {
      return await this.prisma.news.findMany({
        where: {
          AND: {
            journalistId,
            newsTypeId: typeId,
          },
        },
      });
    } catch (e) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }
}

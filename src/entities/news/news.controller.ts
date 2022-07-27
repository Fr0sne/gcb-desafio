import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { JournalistGuard } from '../../middlewares/auth/auth.guard';
import { NewsService } from './news.service';

interface CreateNews {
  id?: string;
  journalistId?: string;
  newsTypeId?: string;
  title: string;
  description?: string;
  body?: string;
  image?: string;
}
@Controller()
export class NewsController {
  constructor(private newsService: NewsService) {}

  @UseGuards(JournalistGuard)
  @Post('/create')
  async create(
    @Req() request: Request,
    @Body() newNotice: Prisma.NewsCreateInput,
  ) {
    return await this.newsService.create({
      ...newNotice,
      journalistId: request.id,
    });
  }

  @UseGuards(JournalistGuard)
  @Post('/update/:id')
  async update(
    @Body() body: CreateNews,
    @Req() request: Request,
    @Param('id') id: string,
  ) {
    return await this.newsService.update(id, {
      ...body,
      journalistId: request.id,
    });
  }

  @UseGuards(JournalistGuard)
  @Post('/delete/:id')
  async delete(@Param('id') id: string) {
    return await this.newsService.delete(id);
  }

  @UseGuards(JournalistGuard)
  @Get('/me')
  async listNews(@Req() request: Request) {
    return await this.newsService.listNews(request.id);
  }

  @UseGuards(JournalistGuard)
  @Get('/type/:id')
  async listNewsByTypeId(@Param('id') id: string, @Req() request: Request) {
    return await this.newsService.listNewsByTypeId(request.id, id);
  }
}

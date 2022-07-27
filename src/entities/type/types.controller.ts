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
import { TypesService } from './types.service';

interface CreateTypes {
  id?: string;
  journalistId?: string;
  newsTypeId?: string;
  title: string;
  description?: string;
  body?: string;
  image?: string;
}
@Controller()
export class TypesController {
  constructor(private newsService: TypesService) {}
  @UseGuards(JournalistGuard)
  @Post('/create')
  async create(@Body() { name }, @Req() request: Request) {
    return await this.newsService.create(request.id, name);
  }

  @UseGuards(JournalistGuard)
  @Post('/update/:id')
  async update(@Param('id') id: string, @Body() { name }) {
    return await this.newsService.update(id, name);
  }

  @UseGuards(JournalistGuard)
  @Post('/delete/:id')
  async delete(@Param('id') id: string) {
    return await this.newsService.delete(id);
  }
  @UseGuards(JournalistGuard)
  @Get('/me')
  async info(@Req() request: Request) {
    return await this.newsService.list(request.id);
  }
}

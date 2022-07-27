import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { JournalistGuard } from '../../middlewares/auth/auth.guard';
import { JournalistService } from './journalist.service';

@Controller()
export class JournalistController {
  constructor(private journalistService: JournalistService) {}
  @Post('/register')
  async create(@Body() newUserData: Prisma.JournalistCreateInput) {
    return this.journalistService.create(newUserData);
  }
  @Post('/login')
  async login(@Body() userData: { email: string; password: string }) {
    return this.journalistService.login(userData);
  }
  @UseGuards(JournalistGuard)
  @Get('/me')
  async info(@Req() request: Request) {
    return this.journalistService.info(request.id);
  }
}

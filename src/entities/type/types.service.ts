import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface CreateTypes {
  id?: string;
  journalistId?: string;
  newsTypeId?: string;
  title: string;
  description?: string;
  body?: string;
  image?: string;
}

@Injectable()
export class TypesService {
  constructor(private prisma: PrismaService) {}

  async create(journalistId: string, name: string) {
    try {
      return await this.prisma.newsType.create({
        data: {
          name,
          journalistId,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(typeId: string, name: string) {
    try {
      return await this.prisma.newsType.update({
        where: {
          id: typeId,
        },
        data: {
          name,
        },
      });
    } catch (e) {
      throw new HttpException(
        'No type found with this id. ',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async delete(typeId: string) {
    try {
      return await this.prisma.newsType.delete({
        where: {
          id: typeId,
        },
      });
    } catch (e) {
      throw new HttpException(
        'No type found with this id.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async list(journalistId: string) {
    try {
      return await this.prisma.newsType.findMany({
        where: {
          journalistId,
        },
      });
    } catch (e) {
      throw new HttpException(
        'No journalist found with this id. Are you logged in?',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

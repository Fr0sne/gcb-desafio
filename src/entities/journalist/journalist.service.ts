import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JournalistMailerProducer } from 'src/email/journalist.mailer.producer';

@Injectable()
export class JournalistService {
  constructor(
    private prisma: PrismaService,
    private mailerQueue: JournalistMailerProducer,
  ) {}
  async create({
    email,
    name,
    lastName,
    password,
  }: Prisma.JournalistCreateInput): Promise<Prisma.JournalistCreateInput> {
    if (!email || !name || !lastName || !password)
      throw new HttpException(
        'Make sure you pass all required fields.',
        HttpStatus.BAD_REQUEST,
      );
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = await this.prisma.journalist.create({
        data: {
          email,
          name,
          lastName,
          password: hashedPassword,
        },
      });
      this.mailerQueue.addNewAccountEmailQueue({
        to: result.email,
        html: `<h3>Welcome, ${result.name} ${result.lastName}!</h3>
        Your account is ready to use!
        `,
      });
      delete result.password;
      return result;
    } catch (e) {
      throw new HttpException('Email already in use.', HttpStatus.AMBIGUOUS);
    }
  }
  async info(id: string) {
    const result = await this.prisma.journalist.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        news: true,
      },
    });
    if (!result)
      throw new HttpException(
        'Non expected exception',
        HttpStatus.EXPECTATION_FAILED,
      );
    return result;
  }
  async login({ email, password }: { email: string; password: string }) {
    if (!email || !password) {
      throw new HttpException(
        'Email or password cannot be null.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.prisma.journalist.findMany({
      where: {
        email,
      },
    });
    if (
      !result.length ||
      !bcrypt.compareSync(password, result?.at(0)?.password || '')
    ) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const threatedResult = {
      ...result[0],
      token: sign({ id: result.at(0).id }, process.env.GCB_SECRET, {
        expiresIn: 300,
      }),
    };

    return threatedResult;
  }
}

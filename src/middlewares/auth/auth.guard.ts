import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JournalistGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization;
    if (!authorization) {
      throw new HttpException('No token provider.', HttpStatus.BAD_REQUEST);
    }
    const [, token] = authorization.split(' ');
    const { id }: any = verify(token, process.env.GCB_SECRET, (err, data) => {
      if (err)
        throw new HttpException(
          'Invalid Token. Please try renew your session.',
          HttpStatus.BAD_REQUEST,
        );
      return data;
    });
    request.id = id;
    return true;
  }
}

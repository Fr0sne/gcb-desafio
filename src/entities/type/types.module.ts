import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

@Module({
  controllers: [TypesController],
  providers: [TypesService],
  imports: [DatabaseModule],
})
export class TypesModule {}

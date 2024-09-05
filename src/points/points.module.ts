import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Points, UsageLocation } from './entity/index';
import { UserModule } from 'src/user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Points, UsageLocation]), UserModule],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}

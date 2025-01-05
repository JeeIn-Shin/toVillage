import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';
import { BuildingTemplate, UserBuildings } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingTemplate, UserBuildings])],
  controllers: [VillageController],
  providers: [VillageService],
})
export class VillageModule {}

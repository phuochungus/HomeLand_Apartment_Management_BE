// @ts-nocheck
import { Module } from "@nestjs/common/decorators";
import { BuildingService, TypeORMBuildingService } from "./building.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { Building } from "./entities/building.entity";
import { Floor } from "../floor/entities/floor.entity";
import { BuildingController } from "./building.controller";
import { Like } from "typeorm";
import { Apartment } from "../apartment/entities/apartment.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Building, Floor, Apartment]), IdGeneratorModule],
  controllers: [BuildingController],
  providers: [TypeORMBuildingService],
  exports: [TypeORMBuildingService]
})
export class BuildingModule {}
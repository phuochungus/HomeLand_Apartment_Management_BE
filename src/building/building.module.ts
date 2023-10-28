import { Module } from "@nestjs/common/decorators";
import { BuildingService, TypeORMBuildingService } from "./building.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "src/id-generator/id-generator.module";
import { StorageModule } from "src/storage/storage.module";
import { Building } from "./entities/building.entity";
import { Floor } from "src/floor/entities/floor.entity";
import { BuildingController } from "./building.controller";
import { Like } from "typeorm";
@Module(
  {
    imports: [
        TypeOrmModule.forFeature([Building, Floor]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [BuildingController],
    providers: [        
        {
            provide: BuildingService,
            useClass: TypeORMBuildingService,
        },
    ],
    exports: [BuildingService],
  }
)
export class BuildingModule {}

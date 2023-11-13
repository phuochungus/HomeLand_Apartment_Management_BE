import { Module } from "@nestjs/common/decorators";
import { BuildingService, TypeORMBuildingService } from "./building.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageManagerModule } from "../storage/storage.module";
import { Building } from "./entities/building.entity";
import { Floor } from "../floor/entities/floor.entity";
import { BuildingController } from "./building.controller";
import { Manager } from "src/manager/entities/manager.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([Building, Floor, Manager]),
        IdGeneratorModule,
        StorageManagerModule,
    ],
    controllers: [BuildingController],
    providers: [
        {
            provide: BuildingService,
            useClass: TypeORMBuildingService,
        },
    ],
    exports: [BuildingService],
})
export class BuildingModule {}

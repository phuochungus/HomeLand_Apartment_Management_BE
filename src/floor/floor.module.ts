import { FloorService, FloorServiceImp } from "./floor.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { Floor } from "./entities/floor.entity";
import { Building } from "../building/entities/building.entity";
import { FloorController } from "./floor.controller";
import { Global, Module } from "@nestjs/common";
@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Building, Floor]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [FloorController],
    providers: [
        {
            provide: FloorService,
            useClass: FloorServiceImp,
        },
    ],
    exports: [FloorService],
})
export class FloorModule {}

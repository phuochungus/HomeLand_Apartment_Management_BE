import { Module } from "@nestjs/common";
import { ApartmentService, ApartmentServiceImp } from "./apartment.service";
import { ApartmentController } from "./apartment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Apartment } from "./entities/apartment.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageManagerModule } from "../storage/storage.module";
import { Resident } from "../resident/entities/resident.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Apartment, Resident]),
        IdGeneratorModule,
        StorageManagerModule,
    ],
    controllers: [ApartmentController],
    providers: [
        {
            provide: ApartmentService,
            useClass: ApartmentServiceImp,
        },
    ],
    exports: [ApartmentService],
})
export class ApartmentModule {}

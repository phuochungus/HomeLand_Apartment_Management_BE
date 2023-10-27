import { Module } from "@nestjs/common";
import { ApartmentService, TypeORMApartmentService } from "./apartment.service";
import { ApartmentController } from "./apartment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Apartment } from "./entities/apartment.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { Resident } from "../person/entities/person.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Apartment, Resident]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [ApartmentController],
    providers: [
        {
            provide: ApartmentService,
            useClass: TypeORMApartmentService,
        },
    ],
    exports: [ApartmentService],
})
export class ApartmentModule {}

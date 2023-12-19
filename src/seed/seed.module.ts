import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Seed } from "./seed.controller";
import { ApartmentModule } from "../apartment/apartment.module";
import { StorageModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";
import { EmployeeModule } from "src/employee/employee.module";
import { ResidentModule } from "../resident/resident.module";
import { BuildingModule } from "../building/building.module";
import { FloorModule } from "../floor/floor.module";
import { EquipmentModule } from "../equipment/equipment.module";
import { ServicePackageModule } from "../service-package/service-package.module";
import { ServiceModule } from "../service/service.module";

@Module({
    imports: [
        ApartmentModule,
        ResidentModule,
        StorageModule,
        IdGeneratorModule,
        HashModule,
        AvatarGeneratorModule,
        EmployeeModule,
        BuildingModule,
        FloorModule,
        EquipmentModule,
        ServicePackageModule,
        ServiceModule
    ],
    controllers: [Seed],
    providers: [SeedService],
})
export class SeedModule {}

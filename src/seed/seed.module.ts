import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Seed } from "./seed.controller";
import { ApartmentModule } from "../apartment/apartment.module";
import { StorageManagerModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";
import { EmployeeModule } from "src/employee/employee.module";
import { ResidentModule } from "../resident/resident.module";
@Module({
    imports: [
        ApartmentModule,
        ResidentModule,
        StorageManagerModule,
        IdGeneratorModule,
        HashModule,
        AvatarGeneratorModule,
        EmployeeModule,
    ],
    controllers: [Seed],
    providers: [SeedService],
})
export class SeedModule {}

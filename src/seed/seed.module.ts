import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { PersonModule } from "../person/person.module";
import { Seed } from "./seed.controller";
import { ApartmentModule } from "../apartment/apartment.module";
import { StorageModule } from "../storage/storage.module";

@Module({
    imports: [PersonModule, ApartmentModule, StorageModule],
    controllers: [Seed],
    providers: [SeedService],
})
export class SeedModule {}

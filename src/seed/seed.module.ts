import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Seed } from "./seed.controller";
import { ApartmentModule } from "../apartment/apartment.module";
import { StorageModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";

@Module({
    imports: [
        ApartmentModule,
        StorageModule,
        IdGeneratorModule,
        HashModule,
        AvatarGeneratorModule,
    ],
    controllers: [Seed],
    providers: [SeedService],
})
export class SeedModule {}

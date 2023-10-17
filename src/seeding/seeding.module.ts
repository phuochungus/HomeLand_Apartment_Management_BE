import { Module } from "@nestjs/common";
import { SeedingService } from "./seeding.service";
import { PersonModule } from "../person/person.module";
import { SeedingController } from "./seeding.controller";

@Module({
    imports: [PersonModule],
    controllers: [SeedingController],
    providers: [SeedingService],
})
export class SeedingModule {}

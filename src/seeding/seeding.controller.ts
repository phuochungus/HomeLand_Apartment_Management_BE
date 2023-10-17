import { Controller, Get } from "@nestjs/common";
import { SeedingService } from "./seeding.service";

@Controller("/seeding")
export class SeedingController {
    constructor(private readonly seedingService: SeedingService) {}
    @Get()
    async startSeeding() {
        await this.seedingService.startSeeding();
        return "Seeding successfully";
    }
}

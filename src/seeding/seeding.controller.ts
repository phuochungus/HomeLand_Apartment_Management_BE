import { Controller, Post } from "@nestjs/common";
import { SeedingService } from "./seeding.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("development only")
@Controller("/seed")
export class SeedingController {
    constructor(private readonly seedingService: SeedingService) {}

    @ApiOperation({ summary: "Create seed data" })
    /**
     * ***WARNING***: this endpoint should be run only once when the database is empty
     * Create demo resources include:
     * - admin (email: `admin@gmail.com`)
     * - resident (email: `resident@gmail.com`)
     * - manager (email: `manager@gmail.com`)
     * - technician (email: `techinician@gmail.com`)
     * - employee (email: `employee@gmail.com`)
     *
     * **NOTE**: all of them have password: `password`
     */
    @Post()
    startSeeding() {
        return this.seedingService.startSeeding();
    }
}

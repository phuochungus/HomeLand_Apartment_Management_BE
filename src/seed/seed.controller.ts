import { Controller, Delete, Post } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("DEVELOPMENT ONLY")
@Controller("/seed")
export class Seed {
    constructor(private readonly seedService: SeedService) {}
    @ApiOperation({ summary: "Create data" })
    @Post("/start")
    startSeeding() {
        return this.seedService.startSeeding();
    }
    @ApiOperation({ summary: "Init database" })
    @Post("/create")
    async createDB() {
        return await this.seedService.createDB();
    }
    @ApiOperation({ summary: "Drop database" })
    @Delete("/drop")
    async dropDB() {
        return await this.seedService.dropDB();
    }
}

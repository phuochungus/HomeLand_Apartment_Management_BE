import { Repository } from "typeorm";
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    NotFoundException,
    Query,
    Delete,
} from "@nestjs/common";

import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateFloorDto } from "./dto/update-floor.dto";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { FloorService } from "./floor.service";
import { id_ID } from "@faker-js/faker";

@ApiTags("Floor")
@Controller("floor")
export class FloorController {
    constructor(private readonly floorRepository: FloorService) {}

    @ApiConsumes("multipart/form-data")
    @Post()
    @FormDataRequest()
    create(@Body() createFloorDto: CreateFloorDto) {
        return this.floorRepository.create(createFloorDto);
    }
    // search building
    /**
     * search building by name
     * @param query string that admin search by name
     */
    @Get("search")
    async searchBuilding(@Query("query") query: string) {
        const result = await this.floorRepository.search(query);
        return result;
    }
    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })
    @Get()
    findAll() {
        return this.floorRepository.findAll();
    }
    @Get(":id")
    async findOne(@Param("id") id: string) {
        const building = await this.floorRepository.findOne(id);
        if (building) return building;
        throw new NotFoundException("Building not found");
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateBuildingDto: UpdateFloorDto,
    ) {
        const result = await this.floorRepository.update(
            id,
            updateBuildingDto,
        );
        if (result) return { msg: "Building updated" };
        throw new NotFoundException("Building not found");
    }
    @Delete("/:id")
    async softDeleteBuilding(@Param("id") id: string) {
        return await this.floorRepository.delete(id);
    }
}
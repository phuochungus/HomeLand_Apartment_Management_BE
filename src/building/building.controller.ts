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
} from "@nestjs/common";

import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateBuildingDto } from "./dto/update-building.dto";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { BuildingService } from "./building.service";

@ApiTags("Building")
@Controller("building")
export class BuildingController {
    constructor(private readonly buildingRepository: BuildingService) {}

    @ApiConsumes("multipart/form-data")
    @Post()
    @FormDataRequest()
    create(@Body() createBuildingDto: CreateBuildingDto) {
        return this.buildingRepository.create(createBuildingDto);
    }

   
    // search building
    @Get("search")
    async searchBuilding(@Query("query") query: string) {
        const result = await this.buildingRepository.search(query);
        return result;
    }
    //get all building
    // @Get()
    // findAll(@Query("page") page: number) {
    //     if (Number.isNaN(page)) return this.buildingRepository.findAll();
    //     else return this.buildingRepository.findAll(page);
    // }
    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })

    @Get()
    findAll() {
        return this.buildingRepository.findAll();
    }
    // create new building

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const building = await this.buildingRepository.findOne(id);
        if (building) return building;
        throw new NotFoundException("Building not found");
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateBuildingDto: UpdateBuildingDto,
    ) {
        const result = await this.buildingRepository.update(
            id,
            updateBuildingDto,
        );
        if (result) return { msg: "Building updated" };
        throw new NotFoundException("Building not found");
    }
}

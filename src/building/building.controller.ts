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
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";

import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateBuildingDto } from "./dto/update-building.dto";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { BuildingService } from "./building.service";
import { id_ID } from "@faker-js/faker";
import { Pagination } from "nestjs-typeorm-paginate/dist/pagination";
import { IPaginationOptions } from "nestjs-typeorm-paginate/dist/interfaces";
import { Building } from "./entities/building.entity";
@ApiTags("Building")
@Controller("building")
export class BuildingController {
    constructor(private readonly buildingRepository: BuildingService) {}

    @ApiOperation({summary: "create building"})
    @ApiConsumes("multipart/form-data")
    @Post()
    @FormDataRequest()
    create(@Body() createBuildingDto: CreateBuildingDto) {
        return this.buildingRepository.create(createBuildingDto);
    }
    // search building
    /**
     * search building by name
     * @param query string that admin search by name
     */
    @ApiOperation({summary: "report resident of building"})
    @Get("report")  
    async report() {
        const result = await this.buildingRepository.reportResidentOfBuilding();
        return result;
    }

    @ApiOperation({summary: "search building"})
    @Get("search")
    async searchBuilding(@Query("query") query: string) {
        const result = await this.buildingRepository.search(query);
        return result;
    }

    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })

    @ApiOperation({summary: "get all building"})
    @Get()
   
    async findAll(
            @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
            @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
            limit: number = 1,
    ): Promise<Pagination<Building>> {
            const options: IPaginationOptions = {
                    limit,
                    page
            }
        console.log(limit)
            return this.buildingRepository.paginate(options);
    }

    @ApiOperation({summary: "get building by id"})
    @Get(":id")
    async findOne(@Param("id") id: string) {
        const building = await this.buildingRepository.findOne(id);
        if (building) return building;
        throw new NotFoundException("Building not found");
    }

    @ApiOperation({summary: "edit building"})
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

    @ApiOperation({summary: "soft delete building"})
    @Delete("/:id")
    async softDeleteBuilding(@Param("id") id: string) {
        return await this.buildingRepository.delete(id);
    }

    @ApiOperation({summary: "add manager to building"})
    @Post("/:id/addManagers")
    async addManagerToBuilding(@Param ("id") id: string, @Query("managerIds" ) managerIds : string[]) {
        return await this.buildingRepository.addManagersToBuilding(managerIds, id)
    }

    @ApiOperation({summary: "delete manager from building"})
    @Post("/:id/deleteManager")
    async deleteManager(@Param ("id") id: string, @Query("managerId" ) managerId : string) {
        return await this.buildingRepository.deleteManager(id, managerId)
    }
}

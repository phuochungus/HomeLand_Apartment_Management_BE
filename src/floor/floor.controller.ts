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
import { UpdateFloorDto } from "./dto/update-floor.dto";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { FloorService } from "./floor.service";
import { id_ID } from "@faker-js/faker";
import { Floor } from "./entities/floor.entity";
import { Pagination } from "nestjs-typeorm-paginate/dist/pagination";
import { IPaginationOptions } from "nestjs-typeorm-paginate/dist/interfaces";
@ApiTags("Floor")
@Controller("floor")
export class FloorController {
    constructor(private readonly floorRepository: FloorService) { }
    @ApiOperation({ summary: "create floor" })
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
    async search(@Query("query") query: string) {
        const result = await this.floorRepository.search(query);
        return result;
    }
    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })
    @ApiOperation({ summary: "get all floor" })
    @Get()
    async findAll() {
        return this.floorRepository.findAll();
    }
    @ApiOperation({ summary: "pagination floor" })
    @Get("/pagination")
    async paginationFloor(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    ): Promise<Pagination<Floor>> {
        const options: IPaginationOptions = {
            limit,
            page,
       
        };

        return this.floorRepository.paginate(options);
    }



    @Get(":id")
    async findOne(@Param("id") id: string) {
        const decodedId = decodeURIComponent(id);
        const building = await this.floorRepository.findOne(decodedId);
        if (building) return building;
        throw new NotFoundException("Floor not found");
    }

    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    async updateFloor(
        @Param("id") id: string,
        @Body() updateFloorDto: UpdateFloorDto,
    ): Promise<Floor> {
        const floor = await this.floorRepository.updateFloor(
            id,
            updateFloorDto,
        );
        return floor;
    }

    @ApiOperation({ summary: "soft delete floor" })
    @Delete("/:id")
    async softDeleteFloor(@Param("id") id: string) {
        return await this.floorRepository.delete(id);
    }
    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //         return this.floorRepository.delete(id);
    // }
}

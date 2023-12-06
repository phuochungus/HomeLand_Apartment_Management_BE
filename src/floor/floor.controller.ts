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

import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateFloorDto } from "./dto/update-floor.dto";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { FloorService } from "./floor.service";
import { id_ID } from "@faker-js/faker";
import { Floor } from "./entities/floor.entity";

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
    @Get()
    findAll() {
        return this.floorRepository.findAll();
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
    @ApiOperation({ summary: "add apartment to floor" })
    @Post("/:id")
    async addApartment(@Param("id") id: string, @Query("apartmentIds") apartmentIds: string[]) {
        return await this.floorRepository.addApartment(apartmentIds, id)
    }

    @ApiOperation({ summary: "delete apartment from floor" })
    @Post("/:id")
    async deleteApartment(@Param("id") id: string, @Query("apartmentId") apartmentId: string) {
        return await this.floorRepository.deleteApartment(id, apartmentId)
    }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //         return this.floorRepository.delete(id);
    // }
}

import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";
import {
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { FormDataRequest } from "nestjs-form-data";
import { TechnicianService } from "./technician.service";
import { CreateTechnicianDto } from "./dto/create-technician.dto";
import { UpdateTechnicianDto } from "./dto/update-technician.dto";
import { Technician } from "./entities/technician.entity";
import { Pagination } from "nestjs-typeorm-paginate/dist/pagination";
import { IPaginationOptions } from "nestjs-typeorm-paginate/dist/interfaces";

@ApiTags("Technician")
// @UseGuards(JWTAuthGuard)
// @ApiBearerAuth()
@Controller("Technician")
export class TechnicianController {
    constructor(private readonly technicianService: TechnicianService) {}

    // /**
    //  * @deprecated
    //  * Create person profile, only token from admin or manager can access this API
    //  * - Admin can create manager, resident and techinician
    //  * - Manager can create resident and technician
    //  *
    //  * Other role can not create person profile */
    @ApiOperation({ summary: "Create technician profile" })
    @ApiConsumes("multipart/form-data")
    @ApiUnprocessableEntityResponse({
        description: "Email or phone number already exists",
    })
    @ApiCreatedResponse({
        description: "Create person profile successfully",
    })
    @Post()
    @FormDataRequest()
    async create(@Body() createTechnicianDto: CreateTechnicianDto) {
        return await this.technicianService.create(createTechnicianDto);
    }
    @Get("/search")
    async search(@Query("query") query: string) {
        const result = await this.technicianService.search(query);
        return result;
    }
    @Delete("/:id")
    async softDelete(@Param("id") id: string) {
        const result = await this.technicianService.delete(id);
    }
    /**
     *
     * Create account, only token from admin or manager can access this API
     *
     * Account must associate with person profile
     */
    @ApiOperation({ summary: "update technician" })
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    @Patch("/:id")
    async update(
        @Param("id") id: string,
        @Body() updateTechnicianDto: UpdateTechnicianDto,
    ): Promise<Technician | null> {
        const technician = await this.technicianService.update(
            id,
            updateTechnicianDto,
        );
        return technician;
    }

    @ApiOperation({ summary: "get all technician" })
    @Get()
    async findAll() {
        return this.technicianService.findAll();
    }

    @ApiOperation({ summary: "pagination technician" })
    @Get("/pagination")
    async paginationTechnician(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 1,
    ): Promise<Pagination<Technician>> {
        const options: IPaginationOptions = {
            limit,
            page,
        };
        console.log(limit);
        return this.technicianService.paginate(options);
    }

    @ApiOperation({ summary: "get technician by id" })
    @Get("/:id")
    async findOne(@Param("id") id: string): Promise<Technician | null> {
        const technician = await this.technicianService.findOne(id);
        return technician;
    }
}

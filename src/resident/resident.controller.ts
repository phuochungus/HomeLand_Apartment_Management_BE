import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Param,
    Patch,
    Delete,
    Req,
    Put,
    Query,
    ParseEnumPipe,
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";
import { ResidentRepository } from "./resident.service";
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { FormDataRequest } from "nestjs-form-data";
import { PersonRole } from "../helper/class/profile.entity";
import { JWTAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { Resident } from "./entities/resident.entity";
import { UpdateResidentDto } from "./dto/update-resident.dto";
import { Auth } from "src/helper/decorator/auth.decorator";
import { Pagination } from "nestjs-typeorm-paginate/dist/pagination";
import { IPaginationOptions } from "nestjs-typeorm-paginate/dist/interfaces";

@ApiTags("Resident")
// @UseGuards(JWTAuthGuard)
// @ApiBearerAuth()
// @Auth()
@Controller("resident")
export class ResidentController {
    constructor(private readonly residentRepository: ResidentRepository) {}

    // /**
    //  * @deprecated
    //  * Create person profile, only token from admin or manager can access this API
    //  * - Admin can create manager, resident and techinician
    //  * - Manager can create resident and technician
    //  *
    //  * Other role can not create person profile */
    @ApiOperation({ summary: "Create resident profile" })
    @ApiConsumes("multipart/form-data")
    @ApiUnprocessableEntityResponse({
        description: "Email or phone number already exists",
    })
    @ApiCreatedResponse({
        description: "Create person profile successfully",
    })
    @Post()
    @FormDataRequest()
    async create(@Body() createResidentDto: CreateResidentDto) {
        return await this.residentRepository.create(createResidentDto);
    }
    @Get("/search")
    async searchResident(@Query("query") query: string) {
        const result = await this.residentRepository.search(query);
        return result;
    }
    @Delete("/:id")
    async softDeleteResident(@Param("id") id: string) {
        const result = await this.residentRepository.delete(id);
    }
    /**
     *
     * Create account, only token from admin or manager can access this API
     *
     * Account must associate with person profile
     */
    @ApiOperation({ summary: "update resident" })
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    @Patch("/:id")
    async updateResident(
        @Param("id") id: string,
        @Body() updateResidentDto: UpdateResidentDto,
    ): Promise<Resident> {
        const resident = await this.residentRepository.updateResident(
            id,
            updateResidentDto,
        );
        return resident;
    }
    @ApiOperation({ summary: "get all resident" })
    @Get()
    async findAll(){
        return this.residentRepository.findAll();
    }
    
    @ApiOperation({summary: "pagination resident"})
    @Get("/pagination")
    async paginationResident(
            @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
            @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
            limit: number = 1,
            @Query ("buildingId") buildingId?: string
    ): Promise<Pagination<Resident>> {
            const options: IPaginationOptions = {
                    limit,
                    page
            }
        console.log(limit)
            return this.residentRepository.paginate(options, buildingId);
    }

    @ApiOperation({ summary: "get resident by id" })
    @Get("/:id")
    async findOne(@Param("id") id: string): Promise<Resident | null> {
        const resident = await this.residentRepository.findOne(id);
        return resident;
    }

}

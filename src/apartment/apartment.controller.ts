import {
    Controller,
    Get,
    Body,
    Param,
    NotFoundException,
    Query,
    Post,
    Patch,
    Delete,
} from "@nestjs/common";
import { ApartmentService } from "./apartment.service";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { Auth } from "../helper/decorator/auth.decorator";
import { SearchDto } from "./dto/search-apartment.dto";

@Auth()
@ApiTags("Apartment")
@Controller("apartment")
export class ApartmentController {
    constructor(private readonly apartmentRepository: ApartmentService) {}

    @Post()
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    create(@Body() createApartmentDto: CreateApartmentDto) {
        return this.apartmentRepository.create(createApartmentDto);
    }

    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })
    @Get()
    findAll(@Query("page") page: number) {
        if (Number.isNaN(page)) return this.apartmentRepository.findAll();
        else return this.apartmentRepository.findAll(page);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const apartment = await this.apartmentRepository.findOne(id);
        if (apartment) return apartment;
        throw new NotFoundException("Apartment not found");
    }

    /**
     *
     * @param id apartment id
     * @param updateApartmentDto
     * @returns
     */
    @ApiConsumes("multipart/form-data")
    @Patch(":id")
    @FormDataRequest()
    async update(
        @Param("id") id: string,
        @Body() updateApartmentDto: UpdateApartmentDto,
    ) {
        if (await this.apartmentRepository.update(id, updateApartmentDto)) {
            return await this.findOne(id);
        }
    }

    @ApiOperation({ summary: "add resident to apartment" })
    @Post("/:id/addResidents")
    async addResidentToApartment(
        @Param("id") id: string,
        @Query("residentIds") residentIds: string[],
    ) {
        return await this.apartmentRepository.addResidentToApartment(
            residentIds,
            id,
        );
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return await this.apartmentRepository.delete(id);
    }

    @Post("/search")
    async search(@Body() searchDto: SearchDto) {
        return await this.apartmentRepository.search(
            searchDto.field,
            searchDto.value,
            searchDto.page,
        );
    }
}

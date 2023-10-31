import {
    Controller,
    Get,
    Body,
    Param,
    NotFoundException,
    Query,
    Post,
    Patch,
} from "@nestjs/common";
import { ApartmentService } from "./apartment.service";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
// import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";

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
    @Patch(":id/imageURLs")
    @FormDataRequest()
    async update(
        @Param("id") id: string,
        @Body() updateApartmentDto: UpdateApartmentDto,
    ) {
        return await this.apartmentRepository.update(id, updateApartmentDto);
    }
}

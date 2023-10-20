import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
} from "@nestjs/common";
import { ApartmentService } from "./apartment.service";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Apartment")
@Controller("apartment")
export class ApartmentController {
    constructor(private readonly apartmentService: ApartmentService) {}

    @Post()
    create(@Body() createApartmentDto: CreateApartmentDto) {
        return this.apartmentService.create(createApartmentDto);
    }

    @Get()
    findAll() {
        return this.apartmentService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const apartment = await this.apartmentService.findOne(id);
        if (apartment) return apartment;
        throw new NotFoundException("Apartment not found");
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateApartmentDto: UpdateApartmentDto,
    ) {
        const result = await this.apartmentService.update(
            id,
            updateApartmentDto,
        );
        if (result) return { msg: "Apartment updated" };
        throw new NotFoundException("Apartment not found");
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        const result = await this.apartmentService.softDelete(id);
        if (result) return { msg: "Apartment deleted" };
        throw new NotFoundException("Apartment not found");
    }
}

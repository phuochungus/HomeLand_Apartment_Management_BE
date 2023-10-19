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
import { PropertyService } from "./property.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Property")
@Controller("property")
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    @Post()
    create(@Body() createPropertyDto: CreatePropertyDto) {
        return this.propertyService.create(createPropertyDto);
    }

    @Get()
    findAll() {
        return this.propertyService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const property = await this.propertyService.findOne(id);
        if (property) return property;
        throw new NotFoundException("Property not found");
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updatePropertyDto: UpdatePropertyDto,
    ) {
        const result = await this.propertyService.update(
            id,
            updatePropertyDto,
        );
        if (result) return { msg: "Property updated" };
        throw new NotFoundException("Property not found");
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        const result = await this.propertyService.softDelete(id);
        if (result) return { msg: "Property deleted" };
        throw new NotFoundException("Property not found");
    }
}

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from "@nestjs/common";
import { EquipmentService } from "./equipment.service";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";

@ApiTags("equipment")
@Controller("equipment")
export class EquipmentController {
    constructor(private readonly equipmentService: EquipmentService) {}

    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    @Post()
    create(@Body() createEquipmentDto: CreateEquipmentDto) {
        return this.equipmentService.create(createEquipmentDto);
    }

    @Get()
    async findAll(@Query("page") page: number) {
        return await this.equipmentService.findAll(page);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.equipmentService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateEquipmentDto: UpdateEquipmentDto,
    ) {
        return this.equipmentService.update(id, updateEquipmentDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.equipmentService.remove(id);
    }
}

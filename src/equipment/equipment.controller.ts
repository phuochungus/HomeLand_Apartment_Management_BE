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
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { Auth } from "../helper/decorator/auth.decorator";
import { PersonRole } from "../helper/class/profile.entity";

@Auth()
@ApiTags("equipment")
@Controller("equipment")
export class EquipmentController {
    constructor(private readonly equipmentService: EquipmentService) {}

    @Auth(PersonRole.ADMIN, PersonRole.MANAGER)
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    @Post()
    create(@Body() createEquipmentDto: CreateEquipmentDto) {
        return this.equipmentService.create(createEquipmentDto);
    }

    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })
    @Get()
    async findAll(@Query("page") page?: number) {
        console.log(page);
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

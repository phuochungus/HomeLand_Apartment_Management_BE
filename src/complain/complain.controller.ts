import { Repository } from "typeorm";
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    NotFoundException,
    Delete,
} from "@nestjs/common";

import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { ComplainService } from "./complain.service";
import { CreateComplainDto } from "./dto/create-complain.dto";
import { UpdateComplainDto } from "./dto/update-complain.dto";

@ApiTags("Complain")
@Controller("complain")
export class ComplainController {
    constructor(private readonly complainRepository: ComplainService) {}

    @ApiOperation({ summary: "create complain" })
    @ApiConsumes("multipart/form-data")
    @Post()
    @FormDataRequest()
    create(@Body() createComplainDto: CreateComplainDto) {
        return this.complainRepository.create(createComplainDto);
    }

    @ApiOperation({ summary: "get all complain" })
    @Get()
    findAll() {
        return this.complainRepository.findAll();
    }

    @ApiOperation({ summary: "get all complain of building" })
    @Get("/building/:id")
    getComplainOfBuilding(@Param ("id") manager_id: string) {
        return this.complainRepository.getComplainOfBuilding(manager_id);
    }

    @ApiOperation({ summary: "get complain of resident" })
    @Get("/resident/:id")
    getComplainsOfResident(@Param("id") id: string) {
        return this.complainRepository.getComplainsOfResident(id);
    }

    @ApiOperation({ summary: "get complain by id" })
    @Get(":id")
    async findOne(@Param("id") id: string) {
        const complain = await this.complainRepository.findOne(id);
        if (complain) return complain;
        throw new NotFoundException("Complain not found");
    }

    @ApiOperation({ summary: "edit complain" })
    @FormDataRequest()
    @ApiConsumes("multipart/form-data")
    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateComplainDto: UpdateComplainDto,
    ) {
        const result = await this.complainRepository.update(
            id,
            updateComplainDto,
        );
        if (result) return { msg: "Complain updated" };
        throw new NotFoundException("Complain not found");
    }

    @ApiOperation({ summary: "reject complain" })
    @Patch("/:id/reject")
    async rejectComplain(@Param("id") id: string) {
        return await this.complainRepository.reject(id);
    }

    @ApiOperation({ summary: "delete complain" })
    @Delete("/:id")
    async deleteComplain(@Param("id") id: string) {
        return await this.complainRepository.delete(id);
    }

    
}

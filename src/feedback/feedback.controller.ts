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
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";
import { id_ID } from "@faker-js/faker";
import { Feedback } from "./entities/feedback.entity";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@ApiTags("Feedback")
@Controller("Feedback")
export class FeedbackController {
    constructor(private readonly feedbackRepository: FeedbackService) { }
    @ApiOperation({ summary: "create floor" })
    @ApiConsumes("multipart/form-data")
    @Post()
    @FormDataRequest()
    create(@Body() createFeedbackDto: CreateFeedbackDto) {
        return this.feedbackRepository.create(createFeedbackDto);
    }
    // search building
    /**
     * search building by name
     * @param query string that admin search by name
     */
    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })
    @Get()
    findAll() {
        return this.feedbackRepository.findAll();
    }
    @Get(":id")
    async findOne(@Param("id") id: string) {
        const building = await this.feedbackRepository.findOne(id);
        if (building) return building;
        throw new NotFoundException("Floor not found");
    }

    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    async updateFeedback(
        @Param("id") id: string,
        @Body() updateFeedbackDto: UpdateFeedbackDto,
    ): Promise<Feedback> {
        const floor = await this.feedbackRepository.updateFeedback(
            id,
            updateFeedbackDto,
        );
        return floor;
    }
   

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //         return this.floorRepository.delete(id);
    // }
}

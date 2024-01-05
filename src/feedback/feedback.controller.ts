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
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@ApiTags("Feedback")
@Controller("Feedback")
export class FeedbackController {
    constructor(private readonly feedbackRepository: FeedbackService) {}
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
        name: "Service",
        required: false,
    })
    @Get()
    findAll() {
        return this.feedbackRepository.findAll();
    }
    // @ApiQuery({
    //     name: "Service",
    //     required: false,
    // })
    @Get(":service")
    findAllByService(@Query("service") service: string) {
        return this.feedbackRepository.findByServiceId(service);
    }
    @Get(":id")
    async findOne(@Param("id") id: string) {
        const building = await this.feedbackRepository.findOne(id);

        throw new NotFoundException("Feedback not found");
    }
    @ApiOperation({ summary: "edit feedback" })
    @FormDataRequest()
    @ApiConsumes("multipart/form-data")
    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateFloorDto: UpdateFeedbackDto,
    ) {
        const result = await this.feedbackRepository.update(id, updateFloorDto);
        if (result) return { msg: "Complain updated" };
        throw new NotFoundException("Complain not found");
    }
    @ApiOperation({ summary: "delete feedback" })
    @Delete("/:id")
    async deleteFeedback(@Param("id") id: string) {
        return await this.feedbackRepository.delete(id);
    }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //         return this.floorRepository.delete(id);
    // }
}

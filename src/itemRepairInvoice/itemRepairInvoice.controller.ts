import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    NotFoundException,
    Delete,
    Query,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ItemRepairInvoiceService } from "./itemRepairInvoice.service";
@ApiTags("ItemRepairInvoice")
@Controller("itemRepairInvoice")
export class ItemRepairInvoiceController {
    constructor(private readonly taskRepository: ItemRepairInvoiceService) {}

    @ApiOperation({ summary: "get all task" })
    @Get()
    findAll() {
        return this.taskRepository.findAll();
    }
}

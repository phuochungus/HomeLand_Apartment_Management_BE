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
import { RepairInvoiceService } from "./repairInvoice.service";
import { FormDataRequest } from "nestjs-form-data";
import { CreateItemRepairInvoiceDto } from "./dto/create-repairInvoice.dto";
@ApiTags("RepairInvoice")
@Controller("repairInvoice")
export class RepairInvoiceController {
    constructor(
        private readonly repairInvoiceRepository: RepairInvoiceService,
    ) {}

    @ApiOperation({ summary: "create repair invoice" })
    @Post("/:task_id")
    async create(
        @Body() items: CreateItemRepairInvoiceDto[],
        @Param("task_id") task_id: string,
    ) {
        return await this.repairInvoiceRepository.create(items, task_id);
    }

    @ApiOperation({ summary: "get invoice by task id" })
    @Get("/:task_id")
    getByTaskId(@Param ("task_id") task_id:string) {
        return this.repairInvoiceRepository.getInvoiceByTaskId(task_id);
    }

    @ApiOperation({ summary: "get all invoice" })
    @Get()
    findAll() {
        return this.repairInvoiceRepository.findAll();
    }
  
}

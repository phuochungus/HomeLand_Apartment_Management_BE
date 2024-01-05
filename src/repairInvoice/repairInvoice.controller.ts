import { Controller, Get, Post, Body, Param } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RepairInvoiceService } from "./repairInvoice.service";
import { CreateItemRepairInvoiceDto } from "../itemRepairInvoice/dto/create-itemRepairInvoice.dto";

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
    getByTaskId(@Param("task_id") task_id: string) {
        return this.repairInvoiceRepository.getInvoiceByTaskId(task_id);
    }

    @ApiOperation({ summary: "get all invoice" })
    @Get()
    findAll() {
        return this.repairInvoiceRepository.findAll();
    }
}

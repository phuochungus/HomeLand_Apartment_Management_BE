import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
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

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
import { InvoiceService } from "./invoice.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";

@ApiTags("Invoice")
@Controller("invoice")
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Post("create")
    create(
        @Query() queryParams: any,
    ) {
        return this.invoiceService.create(queryParams);
    }

    @Post()
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    payment(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.payment(createInvoiceDto);
    }

    @Get()
    findAll() {
        return this.invoiceService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.invoiceService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateInvoiceDto: UpdateInvoiceDto,
    ) {
        return this.invoiceService.update(id, updateInvoiceDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.invoiceService.remove(id);
    }
}

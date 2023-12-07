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
import { Auth } from "../helper/decorator/auth.decorator";
import { PersonRole } from "../helper/class/profile.entity";
import { User } from "../helper/decorator/user.decorator";
import { AccountOwner } from "../auth/auth.service";

@ApiTags("Invoice")
@Controller("invoice")
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Post("create/:id")
    create(@Query() queryParams: any, @Param("id") id: string) {
        return this.invoiceService.create(id, queryParams);
    }

    @Post()
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    payment(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.payment(createInvoiceDto);
    }
    @Auth(PersonRole.RESIDENT, PersonRole.MANAGER, PersonRole.ADMIN)
    // @Get("/")
    // async getAllVehicle(@User() user: AccountOwner | null) {
    //     if (user?.role === PersonRole.RESIDENT) {
    //         return await this.vehicleService.getAllVehicleByResidentId(user.id);
    //     }
    //     return await this.vehicleService.getAllVehicle();
    // }
    @Get()
    async findAll(@User() user: AccountOwner | null, @Query("serviceId") serviceId: string) {
        if (user?.role === PersonRole.RESIDENT) {
            return await this.invoiceService.getAllInvoiceWithResidentId(user.id, serviceId);
        }
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

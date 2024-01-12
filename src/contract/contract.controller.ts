import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Redirect,
    Query,
    UseGuards,
    UploadedFile,
    ParseFilePipe,
    NotFoundException,
} from "@nestjs/common";
import { ContractService } from "./contract.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { Auth } from "../helper/decorator/auth.decorator";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { PersonRole } from "../helper/class/profile.entity";
import { SearchContractDto } from "./dto/search-contract-dto";
@ApiTags("Contract")
@Auth(PersonRole.ADMIN)
@Controller("contract")
export class ContractController {
    constructor(private readonly contractService: ContractService) {}

    @Post()
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    create(@Body() createContractDto: CreateContractDto) {
        return this.contractService.create(createContractDto);
    }

    @ApiQuery({
        name: "page",
        required: false,
        description:
            "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
    })
    @Get()
    async findAll(@Query("page") page: number) {
        var data;
        if (Number.isNaN(page)) data = await this.contractService.findAll();
        else data = await this.contractService.findAll(page);
        return { data, current_page: page, per_page: 30, total: data.length };
    }
    @Get("/resident/:residentId")
    @Auth(PersonRole.RESIDENT)
    getContractsOfResident(@Param("residentId") residentId: string) {
        return this.contractService.getContractsOfResident(residentId);
    }

    @Get("/:id")
    findOne(@Param("id") id: string) {
        return this.contractService.findOne(id);
    }

    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    async update(
        @Param("id") id: string,
        @Body() updateContractDto: UpdateContractDto,
    ) {
        const result = await this.contractService.update(id, updateContractDto);
        if (result)
            return [{ msg: "Contract updated" }, await this.findOne(id)];
        throw new NotFoundException("Contract not found");
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.contractService.remove(id);
    }

    @Post("/search/byQuery")
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    async searchResident(@Body() searchContractDto: SearchContractDto) {
        const result = await this.contractService.search( searchContractDto);
        return result;
    }
}

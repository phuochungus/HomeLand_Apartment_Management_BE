import { Manager } from './entities/manager.entity';
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Param,
    Patch,
    Delete,
    Req,
    Put,
    Query,
    ParseEnumPipe,
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";
import {
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { FormDataRequest } from "nestjs-form-data";
import { PersonRole } from "../helper/class/profile.entity";
import { JWTAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Auth } from "src/helper/decorator/auth.decorator";
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Pagination } from "nestjs-typeorm-paginate/dist/pagination";
import { IPaginationOptions } from "nestjs-typeorm-paginate/dist/interfaces";
@ApiTags("Manager")
// @UseGuards(JWTAuthGuard)
// @ApiBearerAuth()
@Controller("Manager")
export class ManagerController {
    constructor(private readonly managerRepository: ManagerService) {}

    // /**
    //  * @deprecated
    //  * Create person profile, only token from admin or manager can access this API
    //  * - Admin can create manager, resident and techinician
    //  * - Manager can create resident and technician
    //  *
    //  * Other role can not create person profile */
    @ApiOperation({ summary: "Create manager profile" })
    @ApiConsumes("multipart/form-data")
    @ApiUnprocessableEntityResponse({
        description: "Email or phone number already exists",
    })
    @ApiCreatedResponse({
        description: "Create person profile successfully",
    })
    @Post()
    @FormDataRequest()
    async create(@Body() createManagerDto: CreateManagerDto) {
      
        return await this.managerRepository.create(createManagerDto);
    }
    @Get("/search")
    async search(@Query("query") query: string) {
        const result = await this.managerRepository.search(query);
        return result;
    }
    @Delete("/:id")
    async softDelete(@Param("id") id: string) {
    
        const result = await this.managerRepository.delete(id);
        
    }
    /**
     *
     * Create account, only token from admin or manager can access this API
     *
     * Account must associate with person profile
     */
    @ApiOperation({ summary: "update manager" })
    @ApiConsumes("multipart/form-data")
    @Patch(":id")
    @FormDataRequest()
    @Patch("/:id")
    async update(
        @Param("id") id: string,
        @Body() updateManagerDto: UpdateManagerDto,
    ): Promise<Manager | null> {

        const manager = await this.managerRepository.update(
            id,
            updateManagerDto,
        );
        return manager;
    }

    @ApiOperation({ summary: "get all manager" })
    @Get()
    async findAll(){
        return this.managerRepository.findAll();
    }
    
    @ApiOperation({summary: "pagination manager"})
    @Get("/pagination")
    async paginationManager(
            @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
            @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
            limit: number = 1,
    ): Promise<Pagination<Manager>> {
            const options: IPaginationOptions = {
                    limit,
                    page
            }
        console.log(limit)
            return this.managerRepository.paginate(options);
    }

    @ApiOperation({ summary: "get manager by id" })
    @Get("/:id")
    async findOne(
        @Param("id") id: string,
    ): Promise<Manager | null> {
        const manager = await this.managerRepository.findOne(id);
        return manager;
    }
}

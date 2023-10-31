
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
} from "@nestjs/common";
import { ResidentRepository } from "./resident.service";
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";



import { FormDataRequest } from "nestjs-form-data";
import { PersonRole } from "../helper/class/profile.entity";
import { JWTAuthGuard } from "src/auth/guard/jwt.guard";
import { CreateResidentDto } from './dto/create-resident.dto';
import { Resident } from './entities/resident.entity';
import { UpdateResidentDto } from './dto/update-resident.dto';

@ApiTags("Resident")
// @UseGuards(JWTAuthGuard)
// @ApiBearerAuth()
@Controller("resident")
export class ResidentController {
    constructor(private readonly residentRepository: ResidentRepository) {}

    // /**
    //  * @deprecated
    //  * Create person profile, only token from admin or manager can access this API
    //  * - Admin can create manager, resident and techinician
    //  * - Manager can create resident and technician
    //  *
    //  * Other role can not create person profile */
    @ApiOperation({ summary: "Create resident profile" })
    @ApiConsumes("multipart/form-data")
    @ApiUnprocessableEntityResponse({
        description: "Email or phone number already exists",
    })
    @ApiCreatedResponse({
        description: "Create person profile successfully",
    })
    @Post()
    @FormDataRequest()
    async create(@Body() createResidentDto: CreateResidentDto) {
        return await this.residentRepository.create(createResidentDto);
    }

    /**
     * 
     * Create account, only token from admin or manager can access this API
     *
     * Account must associate with person profile
     */
    // @ApiOperation({ summary: "Create account" })
    // @Auth(PersonRole.ADMIN, PersonRole.MANAGER)
    // @Patch("/:id/account")
    // async createAccount(
    //     @Param("id") id: string,
    //     @Body() createAccountDto: CreateAccountDto,
    // ): Promise<Resdent> {
    //     return await this.personRepository.createAccount(id, createAccountDto);
    // }
    @ApiOperation({ summary: "update resident" })
    @Patch("/:id")
    async updateResident(
        @Param("id") id: string,
        @Body() updateResidentDto: UpdateResidentDto,
    ): Promise<Resident> {
        const resident = await this.residentRepository.updateResident(id, updateResidentDto)
        return resident;
       
    }

    // @ApiOperation({ summary: "delete account" })
    // @Auth(PersonRole.ADMIN)
    // @Delete("/:id/account")
    // async deleteAcount(
    //     @Param("id") id: string,
    // ) : Promise<boolean> {
    //     const result = await this.personRepository.delete(
    //         id,
    //     );
    //     return result;
    // }

    // @ApiOperation({
    //     summary: "Get all person profile",
    //     deprecated: true,
    // })
    // @ApiQuery({ name: "role", enum: PersonRole, required: false })
    @ApiOperation({ summary: "get all resident" })
    @Get()
    async findAll(
        // @Query("role", new ParseEnumPipe(PersonRole, { optional: true }))
        // role?: PersonRole,
    ): Promise<Resident[]> {
        // if (role) return this.personRepository.findAll(role);
        return this.residentRepository.findAll();
    }
    @ApiOperation({ summary: "get resident by id" })
    @Get('/:id')
    async findOne(
        @Param ('id') id: string
        // @Query("role", new ParseEnumPipe(PersonRole, { optional: true }))
        // role?: PersonRole,
    ): Promise<Resident | null> {
        // if (role) return this.personRepository.findAll(role);
        const resident = await this.residentRepository.findOne(id)
        return resident;
    }
    // @ApiOperation({ summary: "get person by id" })
    // @Get('/:id') 
    // findOne(@Param('id') id:string): Promise<Person |null> {
    //     return this.personRepository.findOne(id)
    // }
}

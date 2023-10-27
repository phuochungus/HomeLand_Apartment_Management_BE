import { UpdateApartmentDto } from './../apartment/dto/update-apartment.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UseGuards,
    Get,
    UploadedFiles,
    Param,
    Patch,
    Delete,
    Req,
    Put
} from "@nestjs/common";
import { PersonRepository } from "./person.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Person, PersonRole } from "./entities/person.entity";
import { JWTAuthGuard } from "../helper/guard";
import { ValidateFilePipe } from "../helper/pipe";
import { MBtoBytes } from "../helper/validation";
import { CreateAccountDto } from "./dto/create-account.dto";
import { Auth } from "../helper/decorator";

@ApiTags("Person")
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
@Controller("person")
export class PersonController {
    constructor(
        private readonly personRepository: PersonRepository,
    ) {}

    /**
     * Create person profile, only token from admin or manager can access this API
     * - Admin can create manager, manager, resident and techinician
     * - Manager can create resident and technician
     *
     * Other role can not create person profile */
    @ApiOperation({ summary: "Create person profile" })
    @ApiConsumes("multipart/form-data")
    @ApiUnprocessableEntityResponse({
        description: "Email or phone number already exists",
    })
    @ApiCreatedResponse({
        description: "Create person profile successfully",
    })
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: "front_identify_card_photo",
                maxCount: 1,
            },
            {
                name: "back_identify_card_photo",
                maxCount: 1,
            },
        ]),
    )
    create(
        @UploadedFiles(
            new ValidateFilePipe([
                {
                    name: "front_identify_card_photo",
                    // limit: MBtoBytes(15),
                    mimetypes: ["image/jpeg", "image/png"],
                },
                {
                    name: "back_identify_card_photo",
                    // limit: MBtoBytes(15),
                    mimetypes: ["image/jpeg", "image/png"],
                },
            ]),
            
        )
        files: {
            front_identify_card_photo: Express.Multer.File;
            back_identify_card_photo: Express.Multer.File;
        },
        @Body() createPersonDto: CreatePersonDto,
    ) {
        console.log(files)
        createPersonDto.front_identify_card_photo =
            files.front_identify_card_photo;
        createPersonDto.back_identify_card_photo =
            files.back_identify_card_photo;
        return this.personRepository.create(createPersonDto);
    }

    /**
     * Create account, only token from admin or manager can access this API
     *
     * Account must associate with person profile
     */
    @ApiOperation({ summary: "Create account" })
    @Auth(PersonRole.ADMIN, PersonRole.MANAGER)
    @Patch("/:id/account")
    async createAccount(
        @Param("id") id: string,
        @Body() createAccountDto: CreateAccountDto,
    ): Promise<Person> {
        return await this.personRepository.createAccount(
            id,
            createAccountDto,
        );
    }
    @ApiOperation({ summary: "update person" })
    @Auth(PersonRole.ADMIN, PersonRole.MANAGER)
    @Patch("/:id/person")
    async updatePerson(
        @Param("id") id: string,
        @Body() updatePersonDto: UpdatePersonDto,
    ): Promise<Person> {
        return await this.personRepository.updatePerson(id, updatePersonDto)
       
    }
    @ApiOperation({ summary: "delete account" })
    @Auth(PersonRole.ADMIN)
    @Delete("/:id/account")
    async deleteAcount(
        @Param("id") id: string,
    ) : Promise<boolean> {
        const result = await this.personRepository.softDelete(
            id,
        );
        return result;
    }

    @ApiOperation({
        summary: "Get all person profile",
    })
    @Get()
    findAll(): Promise<Person[]> {
    
        return this.personRepository.findAll();
    }
    @ApiOperation({ summary: "get person by id" })
    @Get('/:id') 
    findOne(@Param('id') id:string): Promise<Person |null> {
        return this.personRepository.findOne(id)
    }
}

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
import { Person } from "./entities/person.entity";
import { JWTAuthGuard } from "../helper/guard";
import { ValidateFilePipe } from "../helper/pipe";
import { MBtoBytes } from "../helper/validation";
import { CreateAccountDto } from "./dto/create-account.dto";
import { Auth } from "../helper/decorator";

@ApiTags("person")
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
                    limit: MBtoBytes(15),
                    mimetypes: ["image/jpeg", "image/png"],
                },
                {
                    name: "back_identify_card_photo",
                    limit: MBtoBytes(15),
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
        console.log(files);
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
    @Auth("admin", "manager")
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

    @ApiOperation({
        summary: "Get all person profile",
    })
    @Get()
    findAll(): Promise<Person[]> {
        return this.personRepository.findAll();
    }
}

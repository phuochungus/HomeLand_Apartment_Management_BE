import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "./helper/decorator/auth.decorator";
import { PersonRole } from "./helper/class/profile.entity";

@ApiTags("DEVELOPMENT ONLY")
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService, // private readonly personRepository: PersonRepository,
    ) {}

    @Auth()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    /**
     * Create account without need send token in header
     */
    // @Post("/demo_account/:id")
    // createAccount(
    //     @Param("id") id: string,
    //     @Body() createAccountDto: CreateAccountDto,
    // ) {
    //     return this.personRepository.createAccount(id, createAccountDto);
    // }

    /**
     * Create person profile without need send token in header
     */
    // @ApiOperation({ summary: "Create person profile" })
    // @ApiConsumes("multipart/form-data")
    // @ApiUnprocessableEntityResponse({
    //     description: "Email or phone number already exists",
    // })
    // @ApiCreatedResponse({
    //     description: "Create person profile successfully",
    // })
    // @Post("/demo_person")
    // @UseInterceptors(
    //     FileFieldsInterceptor([
    //         {
    //             name: "front_identify_card_photo",
    //             maxCount: 1,
    //         },
    //         {
    //             name: "back_identify_card_photo",
    //             maxCount: 1,
    //         },
    //     ]),
    // )
    // createPerson(
    //     @UploadedFiles()
    //     files: {
    //         front_identify_card_photo: MemoryStoredFile[];
    //         back_identify_card_photo: MemoryStoredFile[];
    //     },
    //     @Body() createPersonDto: CreatePersonDto,
    // ) {
    //     createPersonDto.front_identify_card_photo =
    //         files.front_identify_card_photo[0];
    //     createPersonDto.back_identify_card_photo =
    //         files.back_identify_card_photo[0];
    //     return this.personRepository.create(createPersonDto);
    // }
}

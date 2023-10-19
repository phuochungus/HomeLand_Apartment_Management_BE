import { Controller, Get, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "../helper/decorator";
import { Person } from "../person/entities/person.entity";

@Auth()
@ApiTags("Me")
@Controller("me")
export class MeController {
    @Get()
    getPersonalInfo(@Req() req: any): Person {
        return req.user;
    }
}

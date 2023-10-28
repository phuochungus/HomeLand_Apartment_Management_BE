import { Controller, Get, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "../helper/decorator/auth.decorator";

@Auth()
@ApiTags("Me")
@Controller("me")
export class MeController {
    @Get()
    getPersonalInfo(@Req() req: any) {
        return req.user;
    }
}

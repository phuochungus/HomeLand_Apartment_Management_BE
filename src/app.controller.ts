import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "./helper/decorator/auth.decorator";

@ApiTags("DEVELOPMENT ONLY")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Auth()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}

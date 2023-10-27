import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { Auth } from "../helper/decorator/auth.decorator";
import { SignInDto } from "../auth/dto/signin.dto";
import { AuthService } from "../auth/auth.service";
import { ApiForbiddenResponse, ApiResponse } from "@nestjs/swagger";

@Controller("token")
export class TokenController {
    constructor(private readonly authService: AuthService) {}

    @Auth()
    @Get("/validate")
    @ApiForbiddenResponse({
        description: "Token not have permission",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Token invalid or expired",
    })
    validateToken() {
        return "Token is valid";
    }

    @Post("/expiredToken")
    getExiredToken(@Body() signinDto: SignInDto) {
        return this.authService.signIn(signinDto, "1s");
    }
}

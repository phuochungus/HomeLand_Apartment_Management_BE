import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({ required: true, example: "admin@gmail.com" })
    @IsString()
    email: string;

    @ApiProperty({ required: true, example: "password" })
    @IsString()
    password: string;
}

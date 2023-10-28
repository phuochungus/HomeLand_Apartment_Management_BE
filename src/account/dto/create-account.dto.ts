import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateAccountDto {
    @ApiProperty({
        type: "string",
        format: "email",
        example: "admin@gmail.com",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "password",
    })
    @IsString()
    password: string;
}

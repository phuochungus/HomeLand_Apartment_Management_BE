import { ApiProperty, PickType } from "@nestjs/swagger";
import { Person } from "../../person/entities/person.entity";

export class SignInDto extends PickType(Person, [
    "email",
    "password",
] as const) {
    @ApiProperty({ required: true })
    email: string;
    
    @ApiProperty({ required: true })
    password: string;
}

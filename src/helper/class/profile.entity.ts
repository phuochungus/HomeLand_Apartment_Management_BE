import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsPhoneNumber, IsString } from "class-validator";
import { Column } from "typeorm";

export enum PersonRole {
    RESIDENT = "resident",
    ADMIN = "admin",
    TECHNICIAN = "technician",
    MANAGER = "manager",
    EMPLOYEE = "employee",
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

export class Profile {
    @ApiProperty({
        example: "Nguyen Van A",
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        default: "1990-01-01",
    })
    @IsDateString()
    @Column()
    date_of_birth: Date;

    @ApiProperty({
        default: Gender.MALE,
        type: "enum",
        enum: Gender,
    })
    @IsEnum(Gender)
    @Column({
        type: "enum",
        enum: Gender,
    })
    gender: Gender;

    @Column()
    front_identify_card_photo_URL: string;

    @Column()
    back_identify_card_photo_URL: string;

    @ApiProperty({
        default: "0999999999",
    })
    @IsPhoneNumber("VN")
    @Column({ unique: true })
    phone_number: string;
}

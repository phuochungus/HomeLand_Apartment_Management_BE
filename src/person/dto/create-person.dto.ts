import { ApiProperty, PickType } from "@nestjs/swagger";
import { Person } from "../entities/person.entity";
import { IsOptional } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, isFile } from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";
import { Transform } from "class-transformer";

export class CreatePersonDto extends PickType(Person, [
    "name",
    "role",
    "date_of_birth",
    "gender",
    "phone_number",
    "password",
    "email",
] as const) {
    @ApiProperty({ type: "file", required: true })
    @IsFile()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    front_identify_card_photo: { buffer: Buffer | ArrayBuffer };

    @ApiProperty({ type: "file", required: true })
    @IsFile()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    back_identify_card_photo: { buffer: Buffer | ArrayBuffer };

    @ApiProperty({ type: "file", required: false })
    @Transform(({ value }) => (isFile(value) ? value : undefined))
    @IsOptional()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    avatar_photo?: { buffer: Buffer | ArrayBuffer };
}

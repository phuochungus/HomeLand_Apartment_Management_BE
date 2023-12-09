import { ApiProperty, PickType } from "@nestjs/swagger";
import { Resident } from "../entities/resident.entity";
import { IsOptional, IsString } from "class-validator";
import {
    HasMimeType,
    IsFile,
    MaxFileSize,
    MemoryStoredFile,
    isFile,
} from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";
import { Transform } from "class-transformer";
import { Column } from "typeorm";
import { Profile } from "../../helper/class/profile.entity";

export class CreateResidentDto extends PickType(Profile, [
    "name",
    "date_of_birth",
    "gender",
    "identify_number",
    "phone_number",
] as const) {
    @ApiProperty({ required: false })
    @IsString()
    @Column()
    payment_info: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Column()
    email?: string;

    @ApiProperty({ type: "file", required: true })
    @IsFile()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    front_identify_card_photo: MemoryStoredFile;

    @ApiProperty({ type: "file", required: true })
    @IsFile()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    back_identify_card_photo: MemoryStoredFile;

    @ApiProperty({ type: "file", required: false })
    @IsFile()
    @Transform(({ value }) => (isFile(value) ? value : undefined))
    @IsOptional()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    avatar_photo?: MemoryStoredFile;
}

import { ApiProperty } from "@nestjs/swagger";
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
import { Gender } from "../../helper/class/profile.entity";

export class CreateResidentDto {
    date_of_birth: Date;

    gender: Gender;

    identify_number: string;

    name: string;

    phone_number: string;

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

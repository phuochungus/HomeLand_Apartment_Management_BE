import { ApiProperty, PickType } from "@nestjs/swagger";
import { Employee } from "../entities/employee.entity";
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
import { Profile } from "../../helper/class/profile.entity";
import { Column } from "typeorm";
export class CreateEmployeeDto extends PickType(Profile, [
    "name",
    "date_of_birth",
    "gender",
    "phone_number",
    "identify_number",

] as const) {
    @ApiProperty({})
    @IsOptional()
    @IsString()
    @Column()
    task_info: string;
    
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

    @ApiProperty({ type: "file"})
    @IsFile()
    @Transform(({ value }) => (isFile(value) ? value : undefined))
    @IsOptional()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    profile_picture?: MemoryStoredFile;
}

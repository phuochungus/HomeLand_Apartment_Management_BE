import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateEmployeeDto } from "./create-employee.dto";
import { IsOptional } from "class-validator";
import {
    HasMimeType,
    IsFile,
    MaxFileSize,
    MemoryStoredFile,
} from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";
import { Gender } from "../../helper/class/profile.entity";
export class UpdateEmployeeDto {
    date_of_birth?: Date | undefined;

    gender?: Gender | undefined;

    name?: string | undefined;

    phone_number?: string | undefined;

    profile_picture?: MemoryStoredFile | undefined;

    task_info?: string | undefined;
    
    @ApiProperty({ type: "file" })
    @IsFile()
    @IsOptional()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    front_identify_card_photo: MemoryStoredFile;

    @ApiProperty({ type: "file" })
    @IsFile()
    @IsOptional()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    back_identify_card_photo: MemoryStoredFile;
}

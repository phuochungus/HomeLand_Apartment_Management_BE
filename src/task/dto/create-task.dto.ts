import { Task } from "../entities/task.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsArray, IsNumberString, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { HasMimeType, IsFiles, MaxFileSize } from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";
import { Resident } from "src/resident/entities/resident.entity";

export class CreateTaskDto {
    @ApiProperty()
    @IsString()
    complain_id: string

    @ApiProperty()
    @IsString()
    assigner_id: string


}

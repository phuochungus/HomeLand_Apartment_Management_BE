import { Complain } from "../entities/complain.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { HasMimeType, IsFiles, MaxFileSize } from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";
import { Resident } from "src/resident/entities/resident.entity";
import { Column } from "typeorm";

export class CreateComplainDto extends PickType(Complain, [
    "content",
] as const) {
    @ApiProperty()
    @IsString()
    @Column()
    resident_id: string
}

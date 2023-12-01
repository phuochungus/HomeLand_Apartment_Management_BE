import { ApiProperty, PickType } from "@nestjs/swagger";
import { Apartment } from "../entities/apartment.entity";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import {
    HasMimeType,
    IsFiles,
    MaxFileSize,
    MemoryStoredFile,
} from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";

export class CreateApartmentDto extends PickType(Apartment, [
    "width",
    "length",
    "floor_id",
    "building_id",
    "description",
    "number_of_bathroom",
    "number_of_bedroom",
    "rent",
    "name",
] as const) {
    @ApiProperty({
        type: "file",
        required: true,
        isArray: true,
    })
    @IsFiles()
    @MaxFileSize(10e6, { each: true })
    @HasMimeType(commonImageMIMETypes, { each: true })
    images: MemoryStoredFile[];

    @ApiProperty({
        type: "string",
        required: false,
        isArray: true,
        items: {
            type: "string",
        },
        minItems: 1,
    })
    @IsOptional()
    @IsString({ each: true })
    residentIds?: string[];
}

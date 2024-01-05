import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import {
    HasMimeType,
    IsFiles,
    MaxFileSize,
    MemoryStoredFile,
} from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";

export class CreateApartmentDto {
    width: number;
    length: number;
    number_of_bedroom: number;
    number_of_bathroom: number;
    rent: number;
    name: string;
    description: string;
    floor_id: string;
    building_id: string;

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
    @Transform(({ value }) => {
        if (value && !Array.isArray(value)) return [value];
        return value;
    })
    residentIds?: string[];
}

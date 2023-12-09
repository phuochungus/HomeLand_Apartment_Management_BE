import { Floor } from './../entities/floor.entity';
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { HasMimeType, IsFiles, MaxFileSize } from "nestjs-form-data";
import { commonImageMIMETypes } from "../../helper/constant";

export class CreateFloorDto extends PickType(Floor, [
    "name",
    "building_id"

] as const) {
    @ApiProperty()
    @IsNumberString()
    max_apartment: number

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
    apartmentIds?: string[];
}

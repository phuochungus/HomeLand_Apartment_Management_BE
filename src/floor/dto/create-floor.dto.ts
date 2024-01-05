import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateFloorDto {
    building_id: string;

    name: string;
    
    @ApiProperty()
    @IsNumberString()
    max_apartment: number;

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

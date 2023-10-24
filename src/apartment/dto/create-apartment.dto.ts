import { ApiProperty, PickType } from "@nestjs/swagger";
import { Apartment } from "../entities/apartment.entity";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

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
    "address",
] as const) {
    @ApiProperty({
        type: "file",
        format: "binary",
        required: true,
        isArray: true,
    })
    images: Express.Multer.File[];

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

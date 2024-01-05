import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { MemoryStoredFile } from "nestjs-form-data";
import { IsOptional, Validate, isArray } from "class-validator";
import { IsURLOrImageFile } from "../isURLOrImageFile";
import { Apartment, ApartmentStatus } from "../entities/apartment.entity";
import { Transform } from "class-transformer";
import { Equipment } from "../../equipment/entities/equipment.entity";

export class UpdateApartmentDto {
    name?: string | undefined;
    building_id?: string | undefined;
    description?: string | undefined;
    equipments?: Equipment[] | undefined;
    floor_id?: string | undefined;
    length?: number | undefined;
    number_of_bathroom?: number | undefined;
    number_of_bedroom?: number | undefined;
    rent?: number | undefined;
    status?: ApartmentStatus | undefined;
    width?: number | undefined;
    /**
     * This field cann't be fully tested via Swagger UI
     *
     * Test it via Postman instead (Postman support array of mixed type string-file to construct suitable request)
     * ![alt text](/postman.png)
     */
    @ApiProperty({
        type: "array",
        items: {
            anyOf: [
                {
                    type: "string",
                    format: "url",
                },
                {
                    type: "string",
                    format: "binary",
                },
            ],
        },
    })
    @IsOptional()
    @Transform(({ value }) =>
        isArray(value) ? value : value ? [value] : undefined,
    )
    @Validate(IsURLOrImageFile, { each: true })
    images?: (string | MemoryStoredFile)[];
}

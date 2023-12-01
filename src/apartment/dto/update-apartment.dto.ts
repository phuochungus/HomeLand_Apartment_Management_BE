import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { MemoryStoredFile } from "nestjs-form-data";
import { IsOptional, Validate, isArray } from "class-validator";
import { IsURLOrImageFile } from "../isURLOrImageFile";
import { Apartment } from "../entities/apartment.entity";
import { Transform } from "class-transformer";

export class UpdateApartmentDto extends PartialType(
    OmitType(Apartment, [
        "apartment_id",
        "imageURLs",
        "floor",
        "building",
        "created_at",
        "deleted_at",
        "contracts",
        "residents",
    ] as const),
) {
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
    @Validate(IsURLOrImageFile, { each: true })
    images?: (string | MemoryStoredFile)[];
}

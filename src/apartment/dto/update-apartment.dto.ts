import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { MemoryStoredFile } from "nestjs-form-data";
import { Validate } from "class-validator";
import { IsURLOrImageFile } from "../isURLOrImageFile";
import { Apartment } from "../entities/apartment.entity";

export class UpdateApartmentDto extends PartialType(
    OmitType(Apartment, ["apartment_id", "imageURLs"] as const),
) {
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
    @Validate(IsURLOrImageFile, { each: true })
    images: (string | MemoryStoredFile)[];
}

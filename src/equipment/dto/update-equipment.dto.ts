import { ApiProperty } from "@nestjs/swagger";
import { EquipmentStatus } from "../entities/equipment.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import { IsURLOrImageFile } from "../../apartment/isURLOrImageFile";
import { IsOptional, Validate, isArray } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateEquipmentDto {
    apartment_id?: string | undefined;

    building_id?: string | undefined;

    description?: string | undefined;

    floor_id?: string | undefined;

    name?: string | undefined;

    status?: EquipmentStatus | undefined;

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

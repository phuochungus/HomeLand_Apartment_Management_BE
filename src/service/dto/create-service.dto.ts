import { ApiProperty, PickType } from "@nestjs/swagger";
import { Service } from "../entities/service.entity";
import { IsOptional } from "class-validator";
import { MemoryStoredFile } from "nestjs-form-data";
import { Transform } from "class-transformer";

export class CreateServiceDto extends PickType(Service, [
    "name",
    "description",
] as const) {
    description?: string | undefined;
    name: string;
    @ApiProperty({
        type: "file",
        required: false,
        description: "The service images",
        isArray: true,
    })

    @IsOptional()
    @Transform(({ value }) => {
        if (value && !Array.isArray(value)) return [value];
        return value;
    })
    images: MemoryStoredFile[];
}

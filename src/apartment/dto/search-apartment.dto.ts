import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchDto {
    @IsInt()
    @Min(0)
    @IsOptional()
    page: number = 0;

    @ApiProperty({ example: "name" })
    @IsString()
    field: string;

    @ApiProperty({ example: "Crytal" })
    @IsString()
    value: string;
}

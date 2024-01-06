import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchServiceDto {
    @IsOptional()
    @ApiProperty({nullable:true,required:false})
    searchText?: string;
}

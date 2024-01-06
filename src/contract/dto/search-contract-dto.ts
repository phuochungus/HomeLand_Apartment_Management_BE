import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SearchContractDto{
    @ApiProperty({ example: "name",nullable:true,required:false })
    @IsOptional()
    searchText?: string;
    
    @ApiProperty({ nullable:true,required:false})
    @IsOptional()
    buildingId?: string;
    
    @ApiProperty({ nullable:true,required:false })
    @IsOptional()
    floorId?: string;
    
    @ApiProperty({ nullable:true, required:false })
    @IsOptional()
    apartmentId?: string;
    
}
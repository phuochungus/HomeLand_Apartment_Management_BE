import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class ReportServiceDto {
    @IsOptional()
    @ApiProperty({nullable:true,required:false})
    startDate?: Date;
    
    @IsOptional()
    @ApiProperty({example:new Date(),nullable:true,required:false})
    endDate?: Date;
}

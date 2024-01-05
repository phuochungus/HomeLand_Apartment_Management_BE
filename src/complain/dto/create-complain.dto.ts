import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateComplainDto {
    content: string;
    
    @ApiProperty()
    @IsString()
    @Column()
    resident_id: string;
}

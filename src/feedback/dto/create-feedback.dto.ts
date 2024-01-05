import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateFeedbackDto {
    comment?: string | undefined;

    rating: string;

    @ApiProperty()
    @IsString()
    @Column()
    resident_id: string;

    @ApiProperty()
    @IsString()
    @Column()
    service_id: string;
}

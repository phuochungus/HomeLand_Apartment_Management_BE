import { ApiProperty, PickType } from "@nestjs/swagger";
import { Feedback } from "../entities/feedback.entity";
import { IsOptional, IsString } from "class-validator";
import { MemoryStoredFile } from "nestjs-form-data";
import { Transform } from "class-transformer";
import { Column } from "typeorm";

export class CreateFeedbackDto extends PickType(Feedback, [
        "rating",
        "comment",
] as const) {
        @ApiProperty()
        @IsString()
        @Column()
        resident_id: string

        @ApiProperty()
        @IsString()
        @Column()
        service_id: string
}

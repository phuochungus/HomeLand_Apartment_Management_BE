import { ApiProperty, PickType } from "@nestjs/swagger";
import { Feedback } from "../entities/feedback.entity";
import { IsOptional } from "class-validator";
import { MemoryStoredFile } from "nestjs-form-data";
import { Transform } from "class-transformer";

export class CreateServiceDto extends PickType(Feedback, [
        "resident_id",
        "service_id",
        "rating",
        "comment",
] as const) {
}

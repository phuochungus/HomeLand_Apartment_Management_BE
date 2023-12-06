import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateFeedbackDto } from "./create-feedback.dto";

export class UpdateFeedbackDto extends PartialType(OmitType(CreateFeedbackDto, [
  "resident_id",
  "service_id"
] as const),) {}

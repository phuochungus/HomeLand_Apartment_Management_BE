import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateComplainDto } from "./create-complain.dto";

export class UpdateComplainDto extends PartialType(OmitType(CreateComplainDto, [
  "resident_id"
] as const),) {}

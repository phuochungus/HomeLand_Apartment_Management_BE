import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateResidentDto } from "./create-resident.dto";

export class UpdateResidentDto extends PartialType(
    OmitType(CreateResidentDto, [
        "back_identify_card_photo",
        "front_identify_card_photo",
        "name",
        "identify_number",
        "date_of_birth",
    ] as const),
) {}

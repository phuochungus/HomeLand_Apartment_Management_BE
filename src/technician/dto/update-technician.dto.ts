import { CreateTechnicianDto } from './create-technician.dto';
import { OmitType, PartialType } from "@nestjs/swagger";
export class UpdateTechnicianDto extends PartialType(
    OmitType(CreateTechnicianDto, [
        "back_identify_card_photo",
        "front_identify_card_photo",
        "name",
        "date_of_birth",
        "identify_number"
    ] as const),
) {}

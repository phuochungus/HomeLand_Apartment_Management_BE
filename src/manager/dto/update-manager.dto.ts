import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateManagerDto } from "./create-manager.dto";

export class UpdateManagerDto extends PartialType(
    OmitType(CreateManagerDto, [
        "back_identify_card_photo",
        "front_identify_card_photo",
        "name",
        "date_of_birth",
        "identify_number"
    ] as const),
) {}

import { MemoryStoredFile } from "nestjs-form-data";
import { CreateTechnicianDto } from "./create-technician.dto";
import { OmitType, PartialType } from "@nestjs/swagger";
import { Gender } from "../../helper/class/profile.entity";
export class UpdateTechnicianDto extends PartialType(
    OmitType(CreateTechnicianDto, [
        "back_identify_card_photo",
        "front_identify_card_photo",
        "name",
        "date_of_birth",
        "identify_number",
    ] as const),
) {
    avatar_photo?: MemoryStoredFile | undefined;
    email?: string | undefined;
    gender?: Gender | undefined;
    phone_number?: string | undefined;
}

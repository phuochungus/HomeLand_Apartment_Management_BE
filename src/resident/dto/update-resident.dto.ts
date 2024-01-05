import { MemoryStoredFile } from "nestjs-form-data";
import { Gender } from "../../helper/class/profile.entity";

export class UpdateResidentDto {
    avatar_photo?: MemoryStoredFile | undefined;
    email?: string | undefined;
    gender?: Gender | undefined;
    payment_info?: string | undefined;
    phone_number?: string | undefined;
}

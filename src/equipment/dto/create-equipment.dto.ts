import { EquipmentStatus } from "../entities/equipment.entity";
import { IsImageFiles } from "../../helper/decorator/image-file.decorator";
import { MemoryStoredFile } from "nestjs-form-data";

export class CreateEquipmentDto {
    apartment_id?: string | undefined;

    building_id?: string | undefined;

    description?: string | undefined;

    floor_id?: string | undefined;

    name: string;

    status: EquipmentStatus;

    @IsImageFiles(true)
    images: MemoryStoredFile[];
}

import { OmitType } from "@nestjs/swagger";
import { Equipment } from "../entities/equipment.entity";
import { IsImageFiles } from "../../helper/decorator/image-file.decorator";
import { MemoryStoredFile } from "nestjs-form-data";

export class CreateEquipmentDto extends OmitType(Equipment, [
    "building",
    "apartment",
    "floor",
    "imageURLs",
    "id",
]) {
    @IsImageFiles()
    images: MemoryStoredFile[];
}

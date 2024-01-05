import { IsImageFile } from "../../helper/decorator/image-file.decorator";
import { MemoryStoredFile } from "nestjs-form-data";
import { PickType } from "@nestjs/swagger";
import { Vehicle } from "../entities/vehicle.entity";

export class CreateVehicleDto extends PickType(Vehicle, [
    "residentId",
] as const) {
    residentId: string;
    
    /**
     * The photo must contain a license plate, otherwise the request will be rejected
     */
    @IsImageFile()
    licensePlate: MemoryStoredFile;

    @IsImageFile()
    frontRegistrationPhoto: MemoryStoredFile;

    @IsImageFile()
    backRegistrationPhoto: MemoryStoredFile;
}

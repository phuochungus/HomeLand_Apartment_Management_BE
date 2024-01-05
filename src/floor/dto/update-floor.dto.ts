import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateFloorDto } from "./create-floor.dto";
import { IsNumberString, IsOptional } from "class-validator";

export class UpdateFloorDto extends PartialType(
    OmitType(CreateFloorDto, ["apartmentIds", "max_apartment"] as const),
) {
    building_id?: string | undefined;

    name?: string | undefined;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    max_apartment: number;
}

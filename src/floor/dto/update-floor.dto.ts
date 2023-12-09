import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateFloorDto } from "./create-floor.dto";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
export class UpdateFloorDto extends PartialType(
        OmitType(CreateFloorDto, [
            "apartmentIds",
            "max_apartment"
           
        ] as const),
) {
    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    max_apartment: number

}

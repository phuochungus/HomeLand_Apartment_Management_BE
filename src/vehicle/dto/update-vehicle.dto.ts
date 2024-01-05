import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column } from "typeorm";
import { Status } from "../entities/vehicle.entity";

export class UpdateVehicleDto {
    @ApiProperty({ enum: Status })
    @IsEnum(Status)
    @Column({ enum: Status, default: Status.PENDING })
    status: Status;
}

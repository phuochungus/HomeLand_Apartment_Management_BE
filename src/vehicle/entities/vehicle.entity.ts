import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { Resident } from "../../resident/entities/resident.entity";
import { IsEnum, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

@Entity()
export class Vehicle {
    @PrimaryColumn()
    id: string;

    @Column({ name: "license_plate", unique: true })
    licensePlate: string;

    @Column({ name: "front_registration_photo_url" })
    frontRegistrationPhotoURL: string;

    @Column({ name: "back_registration_photo_url" })
    backRegistrationPhotoURL: string;

    @Column({ name: "license_plate_photo_url" })
    licensePlatePhotoURL: string;

    @ManyToOne(() => Resident, (resident) => resident.vehicles)
    @JoinColumn({ name: "resident_id" })
    resident: Resident;

    @IsString()
    @Column({ name: "resident_id" })
    residentId: string;

    @ApiProperty({ enum: Status })
    @IsEnum(Status)
    @Column({ enum: Status, default: Status.PENDING })
    status: Status;
}

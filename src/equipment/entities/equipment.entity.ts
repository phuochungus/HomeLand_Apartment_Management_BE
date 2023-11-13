import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { Floor } from "../../floor/entities/floor.entity";
import { Building } from "../../building/entities/building.entity";
import { IsEnum, IsOptional, IsString } from "class-validator";

export enum EquipmentStatus {
    AVAILABLE = "AVAILABLE",
    NOT_AVAILABLE = "NOT_AVAILABLE",
    MAINTENANCE = "MAINTENANCE",
}

@Entity()
export class Equipment {
    @PrimaryColumn()
    id: string;

    @IsString()
    @Column()
    name: string;

    @IsEnum(EquipmentStatus)
    @Column({
        type: "enum",
        enum: EquipmentStatus,
        default: EquipmentStatus.NOT_AVAILABLE,
    })
    status: EquipmentStatus;

    @Column("simple-array")
    imageURLs: string[];

    @IsString()
    @Column()
    description: string;

    @ManyToOne(() => Apartment, (apartment) => apartment.equipments)
    @JoinColumn({ name: "apartment_id" })
    apartment?: Apartment;

    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    apartment_id?: string;

    @ManyToOne(() => Floor, (floor) => floor.equipments)
    @JoinColumn({ name: "floor_id" })
    floor?: Floor;

    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    floor_id?: string;

    @ManyToOne(() => Building, (building) => building.equipments)
    @JoinColumn({ name: "building_id" })
    building?: Building;

    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    building_id?: string;
}

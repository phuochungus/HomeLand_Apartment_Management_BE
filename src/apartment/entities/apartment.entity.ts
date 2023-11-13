import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Contract } from "../../contract/entities/contract.entity";
import { Floor } from "../../floor/entities/floor.entity";
import { Building } from "../../building/entities/building.entity";
import { IsEnum, IsInt, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Resident } from "../../resident/entities/resident.entity";
import { Type } from "class-transformer";
import { Equipment } from "../../equipment/entities/equipment.entity";

export enum ApartmentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}
@Entity()
export class Apartment {
    @IsString()
    @PrimaryColumn()
    apartment_id: string;

    @ApiProperty({ example: "St. Crytal" })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({ example: 15 })
    @IsNumber()
    @Type(() => Number)
    @Column()
    width: number;

    @ApiProperty({ example: 20 })
    @IsNumber()
    @Type(() => Number)
    @Column()
    length: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    @Column({ type: "int" })
    number_of_bedroom: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    @Column({ type: "int" })
    number_of_bathroom: number;

    @ApiProperty({ example: 5000000 })
    @IsNumber()
    @Type(() => Number)
    @Column({ type: "numeric" })
    rent: number;

    @ApiProperty({
        type: "enum",
        enum: ApartmentStatus,
        default: ApartmentStatus.INACTIVE,
    })
    @Column({
        type: "enum",
        enum: ApartmentStatus,
        default: ApartmentStatus.INACTIVE,
    })
    @IsEnum(ApartmentStatus)
    status: ApartmentStatus;

    @ApiProperty({ example: "A small apartment" })
    @IsString()
    @Column()
    description: string;

    @ManyToOne(() => Floor, (floor) => floor.apartments)
    @JoinColumn({ name: "floor_id" })
    floor: Floor;

    @ApiProperty({ example: "BLD0/FLR0" })
    @IsString()
    @Column({ nullable: true })
    floor_id: string;

    @ManyToOne(() => Building, (building) => building.apartments)
    @JoinColumn({ name: "building_id" })
    building: Building;

    @ApiProperty({ example: "BLD0" })
    @IsString()
    @Column({ nullable: true })
    building_id: string;

    @OneToMany(() => Resident, (resident) => resident.stay_at, {
        cascade: true,
    })
    residents: Resident[];

    @OneToMany(() => Contract, (contract) => contract.apartment)
    contracts: Contract[];

    @Column("simple-array")
    imageURLs: string[];

    @OneToMany(() => Equipment, (equipment) => equipment.apartment)
    equipments: Equipment[];

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

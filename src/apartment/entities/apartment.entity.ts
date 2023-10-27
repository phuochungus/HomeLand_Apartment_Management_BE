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
import { Resident } from "../../person/entities/person.entity";
import { Contract } from "../../contract/entities/contract.entity";
import { Floor } from "../../floor/entities/floor.entity";
import { Building } from "../../building/entities/building.entity";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum ApartmentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}
@Entity()
export class Apartment {
    @PrimaryColumn()
    apartment_id: string;

    @ApiProperty({ example: 15 })
    @IsNumberString()
    @Column()
    width: number;

    @ApiProperty({ example: 20 })
    @IsNumberString()
    @Column()
    length: number;

    @ApiProperty({ example: 1 })
    @IsNumberString()
    @Column({ type: "int" })
    number_of_bedroom: number;

    @ApiProperty({ example: 1 })
    @IsNumberString()
    @Column({ type: "int" })
    number_of_bathroom: number;

    @ApiProperty({ example: 5000000 })
    @IsNumberString()
    @Column({ type: "numeric" })
    rent: number;

    @Column({
        enum: ApartmentStatus,
        default: ApartmentStatus.ACTIVE,
    })
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
    contract: Contract[];

    @Column("simple-array")
    imageURLs: string[];

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @ApiProperty({ example: "St. Crytal" })
    @IsString()
    @Column()
    name: string;
}

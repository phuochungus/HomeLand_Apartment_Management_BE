import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Building } from "../../building/entities/building.entity";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumberString, IsNumber, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { Equipment } from "../../equipment/entities/equipment.entity";
@Entity()
export class Floor {
    @PrimaryColumn()
    floor_id: string;

    @ApiProperty()
    @IsString()
    @Column()
    name: string;
    
    @ApiProperty({ example: 15 })
    @IsNumberString()
    @Column({nullable: false, type: 'int', default: 0})
    max_apartment?: number;

    @ManyToOne(() => Building, (building) => building.floors)
    @JoinColumn({ name: "building_id" })
    building: Building;

    @ApiProperty({ example: "BLD0" })
    @IsString()
    @Column({ nullable: true })
    building_id: string;

    // @OneToMany(() => Apartment, (property) => property.floor)
  

    @OneToMany(() => Apartment, (apartment) => apartment.floor, {
        cascade: true,
    })
    apartments: Apartment[];
    
    @OneToMany(() => Equipment, (equipment) => equipment.floor)
    equipments: Equipment[];
    @DeleteDateColumn()
    deleted_at?: Date;
  
}

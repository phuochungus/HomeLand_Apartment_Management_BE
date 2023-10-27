import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Building } from "../../building/entities/building.entity";
import { Apartment } from "../../apartment/entities/apartment.entity";

@Entity()
export class Floor {
    @PrimaryColumn()
    floor_id: string;

    @Column()
    name: string;

    @ManyToOne(() => Building, (building) => building.floors)
    @JoinColumn({ name: "building_id" })
    building: Building;

    @Column({ nullable: true })
    building_id?: string;

    @OneToMany(() => Apartment, (property) => property.floor)
    apartments: Apartment[];
}

import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Building } from "../../building/entities/building.entity";
import { Apartment } from "../../apartment/entities/apartment.entity";

@Entity()
export class Floor {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Building, (building) => building.floors)
    building: Building;

    @OneToMany(() => Apartment, (property) => property.floor)
    apartments: Apartment[];
}

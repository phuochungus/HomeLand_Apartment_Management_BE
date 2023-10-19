import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Building } from "../../building/entities/building.entity";
import { Property } from "../../property/entities/property.entity";

@Entity()
export class Floor {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Building, (building) => building.floors)
    building: Building;

    @OneToMany(() => Property, (property) => property.floor)
    properties: Property[];
}

import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Floor } from "../../floor/entities/floor.entity";

@Entity()
export class Building {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Floor, (floor) => floor.building)
    floors: Floor[];
}

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
import { Person } from "../../person/entities/person.entity";
import { Contract } from "../../contract/entities/contract.entity";
import { Image } from "../../image/entities/image.entity";
import { Floor } from "../../floor/entities/floor.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Apartment {
    @ApiProperty()
    @PrimaryColumn()
    apartment_id: string;

    @ApiProperty()
    @Column()
    width: number;

    @ApiProperty()
    @Column()
    length: number;

    @ManyToOne(() => Floor, (floor) => floor.apartments)
    @JoinColumn({ name: "floor_id" })
    floor: Floor;

    @Column({ nullable: true })
    floor_id: string;

    @OneToMany(() => Person, (person) => person.stay_at)
    residents: Person[];

    @OneToMany(() => Contract, (contract) => contract.apartment)
    contract: Contract[];

    @OneToMany(() => Image, (image) => image.apartment)
    images: Image[];

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

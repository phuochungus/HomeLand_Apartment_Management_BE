import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Person } from "../../person/entities/person.entity";
import { Contract } from "../../contract/entities/contract.entity";

@Entity()
export class Property {
    @PrimaryColumn()
    property_id: string;

    @OneToMany(() => Person, (person) => person.stay_at)
    residents: Person[];

    @ManyToOne(() => Contract, (contract) => contract.property_id, {
        nullable: true,
    })
    contract: Contract;
}

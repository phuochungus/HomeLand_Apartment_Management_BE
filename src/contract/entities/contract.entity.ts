import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Person, Resident } from "../../person/entities/person.entity";
import { Apartment } from "../../apartment/entities/apartment.entity";

@Entity()
export class Contract {
    @PrimaryColumn()
    contract_id: string;

    @OneToOne(() => Contract, (contract) => contract.contract_id)
    @JoinColumn()
    previos_contract?: Contract;

    @OneToOne(() => Contract, (contract) => contract.contract_id)
    @JoinColumn()
    next_contract?: Contract;

    @ManyToOne(() => Person, (person) => person.contracts)
    resident: Resident;

    @ManyToOne(() => Apartment, (property) => property.contract)
    @JoinColumn({ name: "property_id" })
    apartment: Apartment;

    @Column({ nullable: true })
    property_id: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

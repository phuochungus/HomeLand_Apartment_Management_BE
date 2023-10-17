import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Person } from "../../person/entities/person.entity";
import { Property } from "../../apartment/entities/apartment.entity";

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
    president_id: string;

    @ManyToOne(() => Property, (property) => property.contract)
    property_id: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

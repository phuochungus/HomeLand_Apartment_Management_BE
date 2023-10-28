import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../helper/class/account.entity";
import { Contract } from "../../contract/entities/contract.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";

@Entity()
export class Resident {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, (account) => account.resident, { nullable: true })
    @JoinColumn({ name: "account_id" })
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;

    @OneToMany(() => Contract, (contract) => contract.resident)
    contracts: Contract[];

    @ManyToOne(() => Apartment, (apartment) => apartment.residents)
    @JoinColumn({ name: "stay_at_apartment_id" })
    stay_at: Apartment;

    @Column({ nullable: true })
    stay_at_apartment_id: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role: PersonRole = PersonRole.RESIDENT;
}

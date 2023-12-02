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
import { Account } from "../../account/entities/account.entity";
import { Contract } from "../../contract/entities/contract.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { Vehicle } from "../../vehicle/entities/vehicle.entity";
import { Complain } from "src/complain/entities/complain.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { Invoice } from "../../invoice/entities/invoice.entity";

@Entity()
export class Resident {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, (account) => account.resident, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn()
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;

    @Column({ nullable: true })
    payment_info?: string;

    @OneToMany(() => Contract, (contract) => contract.resident)
    contracts: Contract[];

    @OneToMany(() => Feedback, (feedback) => feedback.resident)
    feedback: Feedback[];
    
    @OneToMany(() => Invoice, (invoice) => invoice.buyer)
    invoices: Invoice[];


    @ManyToOne(() => Apartment, (apartment) => apartment.residents)
    @JoinColumn({ name: "stay_at_apartment_id" })
    stay_at: Apartment;

    @Column({ nullable: true })
    stay_at_apartment_id: string;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.resident)
    vehicles: Vehicle[];

    @OneToMany(() => Complain, (complain) => complain.resident)
    complains: Complain[];

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role = PersonRole.RESIDENT;
}

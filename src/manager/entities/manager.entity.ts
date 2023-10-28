import {
    Column,
    Entity,
    OneToOne,
    PrimaryColumn,
    JoinColumn,
    DeleteDateColumn,
    CreateDateColumn,
} from "typeorm";
import { PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../helper/class/account.entity";

@Entity()
export class Manager {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, (Account) => Account.manager, { nullable: true })
    @JoinColumn({ name: "account_id" })
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role: PersonRole = PersonRole.MANAGER;
}

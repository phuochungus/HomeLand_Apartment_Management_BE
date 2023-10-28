import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../helper/class/account.entity";

@Entity()
export class Admin {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, (account) => account.admin, { nullable: true })
    @JoinColumn({ name: "account_id" })
    account?: Account;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role: PersonRole = PersonRole.ADMIN;
}

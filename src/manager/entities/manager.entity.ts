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
import { Account } from "../../account/entities/account.entity";

@Entity()
export class Manager {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, { nullable: true, cascade: true })
    @JoinColumn({ name: "account_id" })
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role = PersonRole.MANAGER;
}

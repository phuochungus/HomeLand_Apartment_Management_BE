import {
    Column,
    Entity,
    PrimaryColumn,
    OneToOne,
    DeleteDateColumn,
    CreateDateColumn,
} from "typeorm";
import { PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../helper/class/account.entity";
import { JoinColumn } from "typeorm";

@Entity()
export class Technician {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, (account) => account.technician, {
        nullable: true,
    })
    @JoinColumn({ name: "account_id" })
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role: PersonRole = PersonRole.TECHNICIAN;
}

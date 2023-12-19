import { Building } from './../../building/entities/building.entity';
import {
    Column,
    Entity,
    OneToOne,
    PrimaryColumn,
    JoinColumn,
    DeleteDateColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../account/entities/account.entity";
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class Manager {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, { nullable: true, cascade: true })
    @JoinColumn()
    account?: Account;

    @OneToMany(() => Task, (task) => task.manager)
    @JoinColumn()
    tasks?: Task[];

    @ManyToOne(() => Building, (building) => building.managers)
    @JoinColumn()
    building?: Building;


    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role = PersonRole.MANAGER;
}

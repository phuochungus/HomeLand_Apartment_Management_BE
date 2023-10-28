import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm";
import { Profile } from "../../helper/class/profile.entity";

@Entity()
export class Employee {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm";
import { Profile } from "../../helper/class/profile.entity";
import { Gender, PersonRole } from "../../helper/class/profile.entity";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
@Entity()
export class Employee {
    
    
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @Column({ nullable: true })
    task_info?: string;

    @Column({ nullable: true })
    activated_at?: Date;

    @ApiHideProperty()
    @Column({ nullable: true })
    profilePictureURL?: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role = PersonRole.EMPLOYEE;
}

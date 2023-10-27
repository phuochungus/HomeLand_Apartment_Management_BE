import { Column, Entity, PrimaryColumn } from "typeorm";
import { Profile } from "../../helper/class/profile.entity";

@Entity()
export class Employee {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;
}

import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsOptional, IsEmail, IsString } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { Resident } from "../../resident/entities/resident.entity";
import { OneToOne } from "typeorm";
import { Technician } from "../../technician/entities/technician.entity";
import { Manager } from "../../manager/entities/manager.entity";
import { Admin } from "../../admin/entities/admin.entity";

@Entity()
export class Account {
    @PrimaryColumn()
    id: string;

    @ApiProperty({ required: false, default: "admin@gmail.com" })
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @ApiProperty({ required: false, default: "password" })
    @Exclude({ toPlainOnly: true })
    @IsString()
    @Column()
    password: string;

    @IsString()
    avatarURL: string;

    @OneToOne(() => Resident, (resident) => resident.account, {
        nullable: true,
    })
    resident?: Resident;

    @OneToOne(() => Technician, (technician) => technician.account, {
        nullable: true,
    })
    technician?: Technician;

    @OneToOne(() => Manager, (manager) => manager.account, { nullable: true })
    manager?: Manager;

    @OneToOne(() => Admin, (admin) => admin.account, { nullable: true })
    admin?: Admin;

    @Column({ nullable: true })
    activated_at?: Date;
}

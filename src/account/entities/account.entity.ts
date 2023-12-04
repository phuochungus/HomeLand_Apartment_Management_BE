import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import {
    Column,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    DeleteDateColumn,
    OneToOne,
    BeforeUpdate,
    BeforeInsert,
} from "typeorm";
import { Resident } from "../../resident/entities/resident.entity";
import { Admin } from "../../admin/entities/admin.entity";
import { Technician } from "../../technician/entities/technician.entity";
import { Manager } from "../../manager/entities/manager.entity";

@Entity()
export class Account {
    /**
     * @description the id of the owner of this account,
     * can be: resident's id, admin's id, technician's id, manager's id
     */
    @PrimaryColumn()
    owner_id: string;

    @OneToOne(() => Resident, (resident) => resident.account, {
        nullable: true,
    })
    resident?: Resident;

    @OneToOne(() => Admin, (admin) => admin.account, { nullable: true })
    admin?: Admin;

    @OneToOne(() => Technician, (technician) => technician.account, {
        nullable: true,
    })
    technician?: Technician;

    @OneToOne(() => Manager, (manager) => manager.account, {
        nullable: true,
    })
    manager?: Manager;

    @ApiProperty({ required: false, default: "admin@gmail.com" })
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @ApiProperty({ required: false, default: "password" })
    @IsString()
    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;
    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ nullable: true })
    activated_at?: Date;

    @BeforeUpdate()
    @BeforeInsert()
    async checkIfAccountIsHasMultipleOwner() {
        let owners: any[] = [];
        if (this.resident) owners.push(this.resident);
        if (this.admin) owners.push(this.admin);
        if (this.technician) owners.push(this.technician);
        if (this.manager) owners.push(this.manager);    
        if (owners.length != 1) {
            throw new Error("Account must have only one owner");
        }
    }
}

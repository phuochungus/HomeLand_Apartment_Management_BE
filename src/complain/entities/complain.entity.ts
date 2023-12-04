import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { Floor } from "../../floor/entities/floor.entity";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumberString, IsEnum } from "class-validator";
import { Manager } from "src/manager/entities/manager.entity";
import { Equipment } from "../../equipment/entities/equipment.entity";
import { Task } from "src/task/entities/task.entity";

import { Resident } from "src/resident/entities/resident.entity";

export enum complainStatus {
    PENDING = "PENDING",
    FIXING = "FIXING",
    RECEIVED = "RECEIVED",
    REJECTED = "REJECTED",
    DONE = "DONE",
}
@Entity()
export class Complain {
    @PrimaryColumn()
    complain_id: string;

    @ApiProperty({ required: true })
    @IsString()
    @Column()
    content: string;

    @OneToOne(() => Task, (task) => task.complain, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    task?: Task;    

    @ManyToOne(() => Resident, (resident) => resident.complains)
    @JoinColumn()
    resident: Resident;

    @ApiProperty({ enum: complainStatus })
    @IsEnum(complainStatus)
    @Column({ enum: complainStatus, default: complainStatus.PENDING })
    status: complainStatus;

    @CreateDateColumn()
    created_at: Date;
}

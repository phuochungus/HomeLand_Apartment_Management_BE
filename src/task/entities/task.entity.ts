import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    DeleteDateColumn,
    JoinColumn,
    ManyToMany,
    OneToOne,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { Floor } from "../../floor/entities/floor.entity";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumberString, IsEnum } from "class-validator";
import { Manager } from "src/manager/entities/manager.entity";
import { Equipment } from "../../equipment/entities/equipment.entity";
import { Technician } from "src/technician/entities/technician.entity";
import { Complain } from "src/complain/entities/complain.entity";
import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";



export enum taskStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    CANCEL = "CANCEL",
    DONE = "DONE"
}
@Entity()
export class Task {
    @PrimaryColumn()
    task_id: string;

    @ManyToOne(() => Manager, (manager) => manager.tasks)
    @JoinColumn()
    assigner: Manager;

    @ManyToOne(() => Technician, (technician) => technician.tasks)
    @JoinColumn()
    assignee: Technician

    @OneToOne(() => RepairInvoice, (repairInvoice) => repairInvoice.task, {
        cascade: true,
        onDelete: "CASCADE"
    })
    invoice: RepairInvoice;

    @ApiProperty({ enum: taskStatus })
    @IsEnum(taskStatus)
    @Column({ enum: taskStatus, default: taskStatus.PENDING })
    status: taskStatus;

    @OneToOne(() => Complain, (complain) => complain.task, {
        onDelete:"CASCADE"
    })
    @JoinColumn()
    complain: Complain

    @CreateDateColumn()
    created_at: Date
}

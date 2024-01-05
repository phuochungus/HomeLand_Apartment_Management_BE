import {
    Column,
    Entity,
    PrimaryColumn,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Manager } from "src/manager/entities/manager.entity";
import { Technician } from "src/technician/entities/technician.entity";
import { Complain } from "src/complain/entities/complain.entity";
import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
import { Admin } from "src/admin/entities/admin.entity";

export enum taskStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    CANCEL = "CANCEL",
    DONE = "DONE",
}
@Entity()
export class Task {
    @PrimaryColumn()
    task_id: string;

    @ManyToOne(() => Manager, (manager) => manager.tasks)
    @JoinColumn()
    manager?: Manager;

    @ManyToOne(() => Admin, (admin) => admin.tasks)
    @JoinColumn()
    admin?: Admin;

    @ManyToOne(() => Technician, (technician) => technician.tasks)
    @JoinColumn()
    assignee: Technician;

    @OneToOne(() => RepairInvoice, (repairInvoice) => repairInvoice.task, {
        cascade: true,
        onDelete: "CASCADE",
    })
    invoice: RepairInvoice;

    @ApiProperty({ enum: taskStatus })
    @IsEnum(taskStatus)
    @Column({ enum: taskStatus, default: taskStatus.PENDING })
    status: taskStatus;

    @OneToOne(() => Complain, (complain) => complain.task, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    complain: Complain;

    @CreateDateColumn()
    created_at: Date;
}

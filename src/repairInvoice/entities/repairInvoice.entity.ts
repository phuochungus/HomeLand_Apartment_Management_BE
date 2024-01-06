import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsNumberString, IsString } from "class-validator";
import { ItemRepairInvoice } from "src/itemRepairInvoice/entities/itemRepairInvoice.entity";
import { Resident } from "src/resident/entities/resident.entity";
import { Task } from "src/task/entities/task.entity";

import {OneToOne, OneToMany, Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryColumn, Entity } from "typeorm";
export enum repairInvoiceStatus {
    REJECTED = "Rejected",
    PENDING = "Pending",
    DONE = "Done"

}
@Entity()
export class RepairInvoice {
    @PrimaryColumn()
    id: string;

    @OneToOne(() => Task,(task) => task.invoice, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    task?: Task;
    
    @IsString()
    @ApiProperty({ example: "RESIDENT" })
    @Column()
    buyer_id: string;
    @ManyToOne(() => Resident, (resident) => resident.invoice, {})
    @JoinColumn({ name: "buyer_id", referencedColumnName: "id" })
    buyer?: Resident;
    
    @OneToMany(() => ItemRepairInvoice, (itemRepairInvoice) => itemRepairInvoice.invoice)
    @JoinColumn()
    items?: ItemRepairInvoice[];

    @ApiProperty({ enum: repairInvoiceStatus })
    @IsEnum(repairInvoiceStatus)
    @Column({ enum: repairInvoiceStatus, default: repairInvoiceStatus.PENDING })
    status: repairInvoiceStatus

    
    @Column({ nullable: false, type: "int", default: 0 })
    @IsNumberString()
    total: number;

    @CreateDateColumn()
    created_at: Date;
}



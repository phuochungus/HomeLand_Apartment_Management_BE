import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";
import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
import { Entity, Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
@Entity()
export class ItemRepairInvoice {
    @PrimaryColumn()
    id: string;
    
    @ApiProperty()
    @IsString()
    @Column()
    content: string;
    
    @ApiProperty()
    @IsNumberString()
    @Column()
    price: number;
    
    @ManyToOne(() => RepairInvoice, (repairInvoice) => repairInvoice.items, {onDelete: "CASCADE"})
    @JoinColumn()
    invoice?: RepairInvoice;
    
    @CreateDateColumn()
    created_at: Date;
}



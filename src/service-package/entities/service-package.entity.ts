import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Service } from "../../service/entities/service.entity";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BadRequestException } from "@nestjs/common";
import { Invoice } from "../../invoice/entities/invoice.entity";

@Entity()
export class ServicePackage {
    @IsString()
    @PrimaryColumn()
    servicePackage_id: string;
    
    @IsString()
    @ApiProperty({ example: "Service0" })
    @Column()
    service_id: string;
    
    @IsString()
    @ApiProperty({ example: "Example Service Package" })
    @Column()
    name: string;
    
    @ManyToOne(() => Service, (service) => service.servicePackages, {
        nullable: true,
    })
    @JoinColumn({ name: "service_id" })
    service?: Service;
    
    @ApiProperty({ example: 10 })
    @IsOptional()
    @Column({ nullable: true })
    expired_date?: number;
    
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    @Column({ type: "int" })
    per_unit_price: number;
   
    @OneToMany(() => Invoice, (invoice) => invoice.servicePackage)
    invoices: Invoice[];
    
    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

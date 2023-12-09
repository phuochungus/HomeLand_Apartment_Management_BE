import { IsInt, IsOptional, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { ServicePackage } from "../../service-package/entities/service-package.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Resident } from "../../resident/entities/resident.entity";

@Entity()
export class Invoice {
    @IsString()
    @PrimaryColumn()
    invoice_id: string;

    @IsString()
    @ApiProperty({ example: "ServicePackage0-0" })
    @Column()
    servicePackage_id: string;

    @ManyToOne(() => ServicePackage, (service) => service.invoices, {
        nullable: true,
    })
    @JoinColumn({ name: "servicePackage_id" })
    servicePackage?: ServicePackage;

    @IsString()
    @ApiProperty({ example: "RESIDENT" })
    @Column()
    buyer_id: string;
    @ManyToOne(() => Resident, (resident) => resident.invoices, {})
    @JoinColumn({ name: "buyer_id", referencedColumnName: "id" })
    buyer?: Resident;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @Column({ type: "int" })
    total?: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    @Column({ type: "int" })
    amount: number;

    @ApiProperty({ example: new Date(), description: "The expire date" })
    @IsOptional()
    @Column({ nullable: true })
    expired_at?: Date;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

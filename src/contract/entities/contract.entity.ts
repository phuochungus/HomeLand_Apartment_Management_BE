import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    TableInheritance,
} from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { Resident } from "../../resident/entities/resident.entity";
import {
    ContractRole,
    ContractStatusRole,
} from "../../helper/enums/contractEnum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";


@Entity()
export class Contract {
    @PrimaryColumn()
    contract_id: string;

    @OneToOne(() => Contract, (contract) => contract.contract_id, {
        nullable: true,
    })
    @JoinColumn()
    previous_contract?: Contract | null;

    @OneToOne(() => Contract, (contract) => contract.contract_id, {
        nullable: true,
    })
    @JoinColumn()
    next_contract?: Contract | null;

    @ManyToOne(() => Resident, (resident) => resident.contracts)
    @JoinColumn({ name: "resident_id" })
    resident: Resident;
    @Column({ nullable: true })
    resident_id: string;

    @ManyToOne(() => Apartment, (apartment) => apartment.contracts)
    @JoinColumn({ name: "apartment_id" })
    apartment: Apartment;

    @Column({ nullable: true })
    apartment_id: string;
    @ApiProperty({
        default: ContractRole.RENT,
        type: "enum",
        enum: ContractRole,
    })
    @IsEnum(ContractRole)
    @Column({
        type: "enum",
        enum: ContractRole,
    })
    role: ContractRole;
    @ApiProperty({
        default: ContractStatusRole.INACTIVE,
        type: "enum",
        enum: ContractStatusRole,
    })
    @IsEnum(ContractStatusRole)
    @Column({
        type: "enum",
        enum: ContractStatusRole,
    })
    status: ContractStatusRole;

    @CreateDateColumn()
    created_at: Date;

    @Column({nullable: true})
    expire_at?: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ nullable: true })
    contract_with_signature_photo_URL?: string;
}

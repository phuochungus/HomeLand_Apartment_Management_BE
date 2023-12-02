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
import { Service } from "../../service/entities/service.entity";
import { Resident } from "../../resident/entities/resident.entity";
import {
        ContractRole,
        ContractStatusRole,
} from "../../helper/enums/contractEnum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";


@Entity()
export class Feedback {
        @PrimaryColumn()
        feedback_id: string;

        @ApiProperty({
        })
        @IsString()
        @Column()
        rating: string;

        @ApiProperty({       
        })
        @IsOptional()
        @Column({ nullable: true })
        comment?: string;

        @ManyToOne(() => Resident, (resident) => resident.feedback)
        @JoinColumn({ name: "resident_id" })
        resident: Resident;
        @Column({ nullable: true })
        resident_id: string;

        @ManyToOne(() => Service, (service) => service.feedback)
        @JoinColumn({ name: "service_id" })
        service: Service;
        @Column({ nullable: true })
        service_id: string;

        @CreateDateColumn()
        created_at: Date;

        @DeleteDateColumn()
        deleted_at?: Date;

}

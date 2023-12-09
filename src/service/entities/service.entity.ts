import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    OneToMany,
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
import { IsEnum, IsOptional, IsString } from "class-validator";
import { on } from "events";
import { ServicePackage } from "../../service-package/entities/service-package.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
@Entity()
export class Service {
    @PrimaryColumn()
    @IsString()
    service_id: string;

    @ApiProperty({
        example: "Example Service",
        description: "The service name",
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        example: "Example Service",
        description: "The service description",
    })
    @IsOptional()
    @Column({ nullable: true })
    description?: string;

    @Column("simple-array", { nullable: true })
    imageURLs?: string[];

    @IsOptional()
    @OneToMany(() => ServicePackage, (service) => service.service, {
        nullable: true,
    })

    @OneToMany(() => ServicePackage, (feedback) => feedback.service)
    feedback: Feedback[];

    @OneToMany(() => ServicePackage, (servicePackage) => servicePackage.service)
    servicePackages: ServicePackage[];

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
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

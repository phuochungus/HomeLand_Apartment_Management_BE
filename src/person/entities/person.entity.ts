import {
    PrimaryColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ChildEntity,
    Entity,
    TableInheritance,
    OneToMany,
} from "typeorm";
import { Property } from "../../apartment/entities/apartment.entity";
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from "class-validator";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IdGeneratorService } from "../../id_generator/id-generator.service";
import { Contract } from "../../contract/entities/contract.entity";

export enum PersonRole {
    RESIDENT = "resident",
    ADMIN = "admin",
    TECHINICIAN = "technician",
    MANAGER = "manager",
    EMPLOYEE = "employee",
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

@Entity()
@TableInheritance({
    column: {
        type: "enum",
        name: "role",
        enum: PersonRole,
    },
})
export class Person {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Property, (apartment) => apartment.residents, {
        nullable: true,
        eager: true,
    })
    stay_at?: Property;

    @OneToMany(() => Contract, (contract) => contract.president_id)
    contracts: Contract[];

    @IsEnum(PersonRole)
    @Column({
        type: "enum",
        enum: PersonRole,
    })
    role: PersonRole;

    @ApiProperty({
        example: "Nguyen Van A",
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        example: "1999-01-01",
    })
    @IsDateString()
    @Column()
    date_of_birth: Date;

    @IsEnum(Gender)
    @Column({
        type: "enum",
        enum: Gender,
    })
    gender: Gender;

    @Column()
    front_identify_card_photo_URL: string;

    @Column()
    back_identify_card_photo_URL: string;

    @IsPhoneNumber("VN")
    @Column({ unique: true })
    phone_number: string;

    @Column({ nullable: true })
    activated_at?: Date;

    @Exclude()
    @IsOptional()
    @Column({ nullable: true })
    password?: string;

    @IsOptional()
    @IsEmail()
    @Column({ nullable: true, unique: true })
    email?: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

@ChildEntity(PersonRole.RESIDENT)
export class Resident extends Person {
    constructor() {
        super();
        if (!this.id) this.id = "R" + IdGeneratorService.generateId();
    }

    role: PersonRole = PersonRole.RESIDENT;
}

@ChildEntity(PersonRole.ADMIN)
export class Admin extends Person {
    constructor() {
        super();
        if (!this.id) this.id = "A" + IdGeneratorService.generateId();
    }

    @Column({ enum: PersonRole, default: String(PersonRole.ADMIN) })
    role: PersonRole = PersonRole.ADMIN;
}

@ChildEntity(PersonRole.MANAGER)
export class Manager extends Person {
    constructor() {
        super();
        if (!this.id) this.id = "M" + IdGeneratorService.generateId();
    }

    @Column({ enum: PersonRole, default: PersonRole.MANAGER })
    role: PersonRole = PersonRole.MANAGER;
}

@ChildEntity(PersonRole.TECHINICIAN)
export class Technician extends Person {
    constructor() {
        super();
        if (!this.id) this.id = "T" + IdGeneratorService.generateId();
    }

    @Column({ enum: PersonRole, default: PersonRole.TECHINICIAN })
    role: PersonRole = PersonRole.TECHINICIAN;
}

@ChildEntity(PersonRole.EMPLOYEE)
export class Employee extends Person {
    constructor() {
        super();
        if (!this.id) this.id = "E" + IdGeneratorService.generateId();
    }

    @Column({ enum: PersonRole, default: PersonRole.EMPLOYEE })
    role: PersonRole = PersonRole.EMPLOYEE;
}

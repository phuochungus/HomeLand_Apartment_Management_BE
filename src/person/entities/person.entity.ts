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
    JoinColumn,
} from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";
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

    @ManyToOne(() => Apartment, (apartment) => apartment.residents, {
        nullable: true,
        eager: true,
    })
    stay_at?: Apartment;

    @OneToMany(() => Contract, (contract) => contract.resident)
    contracts: Contract[];

    @ApiProperty({
        example: "Nguyen Van A",
    })
    @IsString()
    @Column()
    name: string;

    @ApiProperty({
        default: PersonRole.ADMIN,
        type: "enum",
        enum: PersonRole,
    })
    @IsEnum(PersonRole)
    @Column({
        type: "enum",
        enum: PersonRole,
    })
    role: PersonRole;

    @ApiProperty({
        default: "1990-01-01",
    })
    @IsDateString()
    @Column()
    date_of_birth: Date;

    @ApiProperty({
        default: Gender.MALE,
        type: "enum",
        enum: Gender,
    })
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

    @ApiProperty({
        default: "0999999999",
    })
    @IsPhoneNumber("VN")
    @Column({ unique: true })
    phone_number: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    activated_at?: Date;

    @ApiProperty({ required: false, default: "admin@gmail.com" })
    @IsOptional()
    @IsEmail()
    @Column({ nullable: true, unique: true })
    email?: string;

    @ApiProperty({ required: false, default: "password" })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true })
    password?: string;

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ required: false })
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

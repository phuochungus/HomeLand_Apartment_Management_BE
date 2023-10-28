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
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Contract } from "../../contract/entities/contract.entity";
import { Gender, PersonRole } from "../../helper/class/profile.entity";

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
    @JoinColumn({ name: "stay_at_apartment_id" })
    stay_at?: Apartment;

    @Column({ nullable: true })
    stay_at_apartment_id?: string;

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

    @ApiHideProperty()
    @Column({ nullable: true })
    avatarURL?: string;

    @ApiProperty({ required: false })
    @DeleteDateColumn()
    deleted_at?: Date;
}

@ChildEntity(PersonRole.RESIDENT)
export class Resident extends Person {
    @Column({
        enum: PersonRole,
        default: String(PersonRole.RESIDENT),
    })
    role: PersonRole = PersonRole.RESIDENT;
    @Column({nullable: true})
    payment_info: string
}

@ChildEntity(PersonRole.ADMIN)
export class Admin extends Person {
    @Column({ enum: PersonRole, default: String(PersonRole.ADMIN) })
    role: PersonRole = PersonRole.ADMIN;
}

@ChildEntity(PersonRole.MANAGER)
export class Manager extends Person {
    @Column({ enum: PersonRole, default: PersonRole.MANAGER })
    role: PersonRole = PersonRole.MANAGER;
}

@ChildEntity(PersonRole.TECHNICIAN)
export class Technician extends Person {
    @Column({ enum: PersonRole, default: PersonRole.TECHNICIAN })
    role: PersonRole = PersonRole.TECHNICIAN;
}

@ChildEntity(PersonRole.EMPLOYEE)
export class Employee extends Person {
    @Column({ enum: PersonRole, default: PersonRole.EMPLOYEE })
    role: PersonRole = PersonRole.EMPLOYEE;
}

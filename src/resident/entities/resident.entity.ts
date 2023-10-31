import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Gender, PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../helper/class/account.entity";
import { Contract } from "../../contract/entities/contract.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsEnum, IsDateString, IsString } from "class-validator";
@Entity()
export class Resident {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, { nullable: true, cascade: true })
    @JoinColumn({ name: "account_id" })
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;
    
    @Column({ nullable: true })
    payment_info?: string;

    
   

    @OneToMany(() => Contract, (contract) => contract.resident)
    contracts: Contract[];

    @ManyToOne(() => Apartment, (apartment) => apartment.residents)
    @JoinColumn({ name: "stay_at_apartment_id" })
    stay_at: Apartment;

    @Column({ nullable: true })
    stay_at_apartment_id: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    // @Column()
    // front_identify_card_photo_URL: string;

    // @Column()
    // back_identify_card_photo_URL: string;

    // @ApiProperty({
    //     default: "0999999999",
    // })
    // @IsPhoneNumber("VN")
    // @Column({ unique: true })
    // phone_number: string;

    // @ApiProperty({
    //     default: "1990-01-01",
    // })
    // @IsDateString()
    // @Column()
    // date_of_birth: Date;

    // @ApiProperty({
    //     default: Gender.MALE,
    //     type: "enum",
    //     enum: Gender,
    // })
    // @IsEnum(Gender)
    // @Column({
    //     type: "enum",
    //     enum: Gender,
    // })
    // gender: Gender;

    role = PersonRole.RESIDENT;
}

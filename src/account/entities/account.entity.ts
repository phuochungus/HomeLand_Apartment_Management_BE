import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import {
    Column,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class Account {
    @PrimaryColumn()
    account_id: string;

    @ApiProperty({ required: false, default: "admin@gmail.com" })
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @ApiProperty({ required: false, default: "password" })
    @IsString()
    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;

    @IsString()
    @Column()
    avatarURL: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ nullable: true })
    activated_at?: Date;
}

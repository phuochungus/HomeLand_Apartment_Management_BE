import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsOptional, IsEmail, IsString } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    activated_at?: Date;

    @ApiProperty({ required: false, default: "admin@gmail.com" })
    @IsOptional()
    @IsEmail()
    @Column({ nullable: true, unique: true })
    email: string;

    @ApiProperty({ required: false, default: "password" })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true })
    password: string;

    @IsString()
    avatarURL: string;
}


import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "../hash/hash.service";
import { SignInDto } from "./dto/signin.dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { PersonRole } from "../helper/class/profile.entity";
import { Manager } from "../manager/entities/manager.entity";
import { Technician } from "../technician/entities/technician.entity";
import { Resident } from "../resident/entities/resident.entity";
import { Admin } from "../admin/entities/admin.entity";
import { DataSource, Repository } from "typeorm";
import { Account } from "../account/entities/account.entity";

export class TokenPayload {
    account_id: string;
}

export abstract class AuthService {
    abstract signIn(
        signInDto: SignInDto,
        expiresIn?: string,
    ): Promise<{ access_token: string; role: PersonRole }>;
    abstract findOwnerByAccountEmail(
        email: string,
    ): Promise<Admin | Manager | Technician | Resident | null>;

    abstract findOwnerByAccountId(
        id: string,
    ): Promise<Admin | Manager | Technician | Resident | null>;
}
@Injectable()
export class AuthServiceImp extends AuthService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
    ) {
        super();
    }

    async signIn(signInDto: SignInDto, expiresIn: string = "30d") {
        const person = await this.findOwnerByAccountEmail(signInDto.email);
        if (
            !person ||
            !person.account ||
            !this.hashService.isMatch(
                signInDto.password,
                person.account.password,
            )
        ) {
            throw new UnauthorizedException("Wrong email or password");
        }
        const payload: TokenPayload = {
            account_id: person.account.account_id,
        };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn,
            }),
            role: PersonRole.ADMIN,
        };
    }

    async findOwnerByAccountEmail(
        email: string,
    ): Promise<Admin | Manager | Technician | Resident | null> {
        const account = await this.accountRepository.findOne({
            where: { email },
        });

        if (!account) return null;

        let owners = await Promise.all([
            await this.dataSource.getRepository(Admin).findOne({
                where: {
                    account: {
                        email,
                    },
                },
                relations: { account: true },
            }),
            await this.dataSource.getRepository(Manager).findOne({
                where: {
                    account: {
                        email,
                    },
                },
                relations: { account: true },
            }),
            await this.dataSource.getRepository(Technician).findOne({
                where: {
                    account: {
                        email,
                    },
                },
                relations: { account: true },
            }),
            await this.dataSource.getRepository(Resident).findOne({
                where: {
                    account: {
                        email,
                    },
                },
                relations: { account: true },
            }),
        ]);
        return owners.reduce((acc, cur) => acc || cur, null);
    }

    async findOwnerByAccountId(
        id: string,
    ): Promise<Admin | Manager | Technician | Resident | null> {
        const account = await this.accountRepository.findOne({
            where: { account_id: id },
        });

        if (!account) return null;

        let owners = await Promise.all([
            await this.dataSource.getRepository(Admin).findOne({
                where: {
                    account: {
                        account_id: id,
                    },
                },
                relations: { account: true },
            }),
            await this.dataSource.getRepository(Manager).findOne({
                where: {
                    account: {
                        account_id: id,
                    },
                },
                relations: { account: true },
            }),
            await this.dataSource.getRepository(Technician).findOne({
                where: {
                    account: {
                        account_id: id,
                    },
                },
                relations: { account: true },
            }),
            await this.dataSource.getRepository(Resident).findOne({
                where: {
                    account: {
                        account_id: id,
                    },
                },
                relations: { account: true },
            }),
        ]);
        return owners.reduce((acc, cur) => acc || cur, null);
    }
}

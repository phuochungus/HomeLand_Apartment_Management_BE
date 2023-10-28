import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "../hash/hash.service";
import { SignInDto } from "./dto/signin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PersonRole } from "../helper/class/profile.entity";
import { Manager } from "../manager/entities/manager.entity";
import { Technician } from "../technician/entities/technician.entity";
import { Resident } from "../resident/entities/resident.entity";
import { Admin } from "../admin/entities/admin.entity";
import { Repository } from "typeorm";

export class TokenPayload {
    id: string;
}

export abstract class AuthService {
    abstract signIn(
        signInDto: SignInDto,
        expiresIn?: string,
    ): Promise<{ access_token: string; role: PersonRole }>;
    abstract findAccountOwnerByEmail(
        email: string,
    ): Promise<Admin | Manager | Technician | Resident | null>;

    abstract findAccountOwnerById(
        id: string,
    ): Promise<Admin | Manager | Technician | Resident | null>;
}
@Injectable()
export class AuthServiceImp extends AuthService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        @InjectRepository(Technician)
        private readonly technicianRepository: Repository<Technician>,
        @InjectRepository(Resident)
        private readonly residentRepository: Repository<Resident>,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
    ) {
        super();
    }

    async signIn(signInDto: SignInDto, expiresIn: string = "30d") {
        const person = await this.findAccountOwnerByEmail(signInDto.email);
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
            id: person.id,
        };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn,
            }),
            role: PersonRole.ADMIN,
        };
    }

    async findAccountOwnerByEmail(
        email: string,
    ): Promise<Admin | Manager | Technician | Resident | null> {
        return await Promise.any([
            this.adminRepository.findOne({
                where: { account: { email } },
            }),
            this.managerRepository.findOne({
                where: { account: { email } },
            }),
            this.technicianRepository.findOne({
                where: { account: { email } },
            }),
            this.residentRepository.findOne({
                where: { account: { email } },
            }),
        ]);
    }

    async findAccountOwnerById(
        id: string,
    ): Promise<Admin | Manager | Technician | Resident | null> {
        return await Promise.any([
            this.adminRepository.findOne({
                where: { id },
            }),
            this.managerRepository.findOne({
                where: { id },
            }),
            this.technicianRepository.findOne({
                where: { id },
            }),
            this.residentRepository.findOne({
                where: { id },
            }),
        ]);
    }
}

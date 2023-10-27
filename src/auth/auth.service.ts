import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "../hash/hash.service";
import { PersonRepository } from "../person/person.service";
import { TokenPayload } from "./auth.controller";
import { SignInDto } from "./dto/signin.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly personService: PersonRepository,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
    ) {}

    async signIn(signInDto: SignInDto, expiresIn: string = "30d") {
        const person = await this.personService.findOneByEmail(signInDto.email);
        if (
            !person ||
            !person.password ||
            !this.hashService.isMatch(signInDto.password, person.password)
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
            role: person.role,
        };
    }
}

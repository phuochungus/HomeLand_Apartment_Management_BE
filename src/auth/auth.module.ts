import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PersonModule } from "../person/person.module";
import { HashModule } from "../hash/hash.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [PersonModule, HashModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}

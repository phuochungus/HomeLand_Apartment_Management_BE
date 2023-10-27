import { Module } from "@nestjs/common";
import { TokenController } from "./token.controller.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [AuthModule],
    controllers: [TokenController],
})
export class TokenModule {}

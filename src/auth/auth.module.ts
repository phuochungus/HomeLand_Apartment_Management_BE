import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { HashModule } from "../hash/hash.module";
import { AuthService, AuthServiceImp } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "../admin/entities/admin.entity";
import { Manager } from "../manager/entities/manager.entity";
import { Technician } from "../technician/entities/technician.entity";
import { Resident } from "../resident/entities/resident.entity";
import { JWTAuthGuard } from "./guard/jwt.guard";

@Module({
    imports: [
        HashModule,
        TypeOrmModule.forFeature([Admin, Manager, Technician, Resident]),
    ],
    providers: [
        {
            provide: AuthService,
            useClass: AuthServiceImp,
        },
        JWTAuthGuard,
    ],
    controllers: [AuthController],
    exports: [AuthService, JWTAuthGuard],
})
export class AuthModule {}

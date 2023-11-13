import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageManagerModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "src/avatar-generator/avatar-generator.module";
import { Account } from "src/account/entities/account.entity";
import { AuthModule } from "src/auth/auth.module";
import { TechnicianService } from "./technician.service";
import { TechnicianController } from "./technician.controller";
import { Technician } from "./entities/technician.entity";
@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Technician, Account]),
        IdGeneratorModule,
        AuthModule,
        StorageManagerModule,
        HashModule,
        AvatarGeneratorModule,
    ],
    controllers: [TechnicianController],
    providers: [TechnicianService],
    exports: [TechnicianService],
})
export class TechnicianModule {}

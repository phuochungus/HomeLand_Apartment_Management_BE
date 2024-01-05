import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "src/avatar-generator/avatar-generator.module";
import { Account } from "src/account/entities/account.entity";
import { AuthModule } from "src/auth/auth.module";
import { Manager } from "./entities/manager.entity";
import { ManagerController } from "./manager.controller";
import { ManagerService } from "./manager.service";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Manager, Account]),
        IdGeneratorModule,
        AuthModule,
        StorageModule,
        HashModule,
        AvatarGeneratorModule,
    ],
    controllers: [ManagerController],
    providers: [ManagerService],
    exports: [ManagerService],
})
export class ManagerModule {}

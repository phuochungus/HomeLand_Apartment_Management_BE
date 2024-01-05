import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";
import { Resident } from "./entities/resident.entity";
import { ResidentController } from "./resident.controller";
import { ResidentServiceImp } from "./resident.service";
import { Account } from "../account/entities/account.entity";
import { AuthModule } from "../auth/auth.module";
import { Contract } from "src/contract/entities/contract.entity";
@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Resident, Account, Contract]),
        IdGeneratorModule,
        AuthModule,
        StorageModule,
        HashModule,
        AvatarGeneratorModule,
    ],
    controllers: [ResidentController],
    providers: [ResidentServiceImp],
    exports: [ResidentServiceImp],
})
export class ResidentModule {}

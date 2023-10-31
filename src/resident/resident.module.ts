import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "src/avatar-generator/avatar-generator.module";
import { Resident } from "./entities/resident.entity";
import { ResidentController } from "./resident.controller";
import { ResidentRepository, ResidentService } from "./resident.service";
import { Account } from "src/account/entities/account.entity";
import { AuthModule } from "src/auth/auth.module";
@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Resident, Account]),
        IdGeneratorModule,
        AuthModule,
        StorageModule,
        HashModule,
        AvatarGeneratorModule,
    ],
    controllers: [ResidentController],
    providers: [
        {
            provide: ResidentRepository,
            useClass: ResidentService,
        },
    ],
})
export class ResidentModule {}

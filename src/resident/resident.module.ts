import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "src/avatar-generator/avatar-generator.module";
import { Resident } from "./entities/resident.entity";
import { ResidentController } from "./resident.controller";
import { ResidentRepository, ResidentService } from "./resident.service";
import { Account } from "src/helper/class/account.entity";
@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Resident, Account]),
        IdGeneratorModule,
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

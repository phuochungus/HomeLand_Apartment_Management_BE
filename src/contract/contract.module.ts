import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { Contract } from "./entities/contract.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { StorageModule } from "src/storage/storage.module";
import { IdGeneratorModule } from "src/id-generator/id-generator.module";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Contract]), StorageModule, IdGeneratorModule],
    controllers: [ContractController],
    providers: [ContractService],
})
export class ContractModule {}

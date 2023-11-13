import { Module } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { ServiceController } from "./service.controller";
import { Service } from "./entities/service.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StorageManagerModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service]),
        StorageManagerModule,
        IdGeneratorModule,
    ],
    controllers: [ServiceController],
    providers: [ServiceService],
})
export class ServiceModule {}

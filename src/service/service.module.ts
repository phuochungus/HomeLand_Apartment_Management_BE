import { Module } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { ServiceController } from "./service.controller";
import { Service } from "./entities/service.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StorageModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { Client } from "elasticsearch";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service]),
        StorageModule,
        IdGeneratorModule,
    ],
    controllers: [ServiceController],
    providers: [
        ServiceService,
        {
            provide: Client,
            useFactory: () =>
                new Client({ host: process.env.ELASTIC_SEARCH_URL }),
        },
    ],
    exports: [ServiceService],
})
export class ServiceModule {}

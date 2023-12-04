import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { Feedback } from "./entities/feedback.entity";
import { Floor } from "../floor/entities/floor.entity";
import { FeedbackController } from "./feedback.controller";
import { Manager } from "src/manager/entities/manager.entity";
import { Resident } from "src/resident/entities/resident.entity";
import { Service } from "src/service/entities/service.entity";
import {FeedbackService, TypeORMFeedbackService} from "./feedback.service"
@Module({
    imports: [
        TypeOrmModule.forFeature([Feedback, Resident, Service]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [FeedbackController],
    providers: [
        {
            provide: FeedbackService,
            useClass: TypeORMFeedbackService,
        },
    ],
    exports: [FeedbackService],
})
export class FeedbackModule {}

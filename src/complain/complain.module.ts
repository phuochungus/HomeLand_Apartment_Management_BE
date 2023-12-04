import { Module } from "@nestjs/common/decorators";
import { ComplainService } from "./complain.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { Complain } from "./entities/complain.entity";

import { ComplainController } from "./complain.controller";
import { Resident } from "src/resident/entities/resident.entity";
import { Task } from "src/task/entities/task.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([Complain, Resident, Task]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [ComplainController],
    providers: [ComplainService],
    exports: [ComplainService],
})
export class ComplainModule {}

import { Module } from "@nestjs/common/decorators";
import { TaskService } from "./task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { TaskController } from "./task.controller";
import { Resident } from "src/resident/entities/resident.entity";
import { Task } from "src/task/entities/task.entity";
import { Manager } from "src/manager/entities/manager.entity";
import { Technician } from "src/technician/entities/technician.entity";
import { Complain } from "src/complain/entities/complain.entity";
import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
import { Admin } from "src/admin/entities/admin.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([Task, Complain, Manager, Technician, RepairInvoice, Admin]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {}

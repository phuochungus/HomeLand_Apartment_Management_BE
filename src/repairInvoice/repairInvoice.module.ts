
import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { Resident } from "src/resident/entities/resident.entity";
import { Manager } from "src/manager/entities/manager.entity";
import { Technician } from "src/technician/entities/technician.entity";
import { Complain } from "src/complain/entities/complain.entity";
import { RepairInvoiceController } from "./repairInvoice.controller";
import { RepairInvoiceService } from "./repairInvoice.service";
import { ItemRepairInvoice } from "src/itemRepairInvoice/entities/itemRepairInvoice.entity";
import { RepairInvoice } from "./entities/repairInvoice.entity";
import { Task } from "src/task/entities/task.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemRepairInvoice, RepairInvoice, Task, Complain]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [RepairInvoiceController],
    providers: [RepairInvoiceService],
    exports: [RepairInvoiceService],
})
export class RepairInvoiceModule {}

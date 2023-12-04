import { ItemRepairInvoice } from 'src/itemRepairInvoice/entities/itemRepairInvoice.entity';
import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { ItemRepairInvoiceController } from './itemRepairInvoice.controller';
import { ItemRepairInvoiceService } from './itemRepairInvoice.service';
import { RepairInvoice } from 'src/repairInvoice/entities/repairInvoice.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([ItemRepairInvoice, RepairInvoice]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [ItemRepairInvoiceController],
    providers: [ItemRepairInvoiceService],
    exports: [ItemRepairInvoiceService],
})
export class ItemRepairInvoiceModule {}

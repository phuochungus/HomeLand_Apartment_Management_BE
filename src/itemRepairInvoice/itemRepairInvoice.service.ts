import { IdGenerator } from "../id-generator/id-generator.service";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRepairInvoice } from "src/itemRepairInvoice/entities/itemRepairInvoice.entity";
import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
@Injectable()
export class ItemRepairInvoiceService {
    constructor(
        @InjectRepository(ItemRepairInvoice)
        private readonly itemRepairInvoiceRepository: Repository<ItemRepairInvoice>,
        @InjectRepository(RepairInvoice)
        private readonly repairInvoice: Repository<RepairInvoice>,
        private readonly idGenerate: IdGenerator,
    ) {}

    async findAll() {
        return await this.itemRepairInvoiceRepository.find();
    }
}

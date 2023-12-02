import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
import { Technician } from "../technician/entities/technician.entity";
import { IdGenerator } from "../id-generator/id-generator.service";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/task/entities/task.entity";
import { ItemRepairInvoice } from "src/itemRepairInvoice/entities/itemRepairInvoice.entity";
import { CreateItemRepairInvoiceDto } from "./dto/create-repairInvoice.dto";
import { isQueryAffected } from "src/helper/validation";
import { Complain } from "src/complain/entities/complain.entity";
@Injectable()
export class RepairInvoiceService {
    constructor(
        @InjectRepository(RepairInvoice)
        private readonly repairInvoiceRepository: Repository<RepairInvoice>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(ItemRepairInvoice)
        private readonly itemRepairInvoiceRepository: Repository<ItemRepairInvoice>,
        @InjectRepository(Complain)
        private readonly complainRepository: Repository<Complain>,
        private readonly idGenerate: IdGenerator,
    ) {}
    async create(items: CreateItemRepairInvoiceDto[], task_id: string) {
        const task = (await this.taskRepository.findOne({
            where: { task_id },
        })) as Task;
        const id = "RI" + this.idGenerate.generateId();
        let total = 0;
        items.forEach((item: any) => {
            total += item.price;
        });
        console.log(items);
        console.log(id);
        const repairInvoice = this.repairInvoiceRepository.create({
            id,
            task,
            total,
        });

        await this.repairInvoiceRepository.save(repairInvoice);
        console.log(repairInvoice);
        items.forEach(async (item) => {
            const item_id = "IRI" + this.idGenerate.generateId();
            const itemData = this.itemRepairInvoiceRepository.create({
                id: item_id,
                ...item,
                invoice: repairInvoice,
            });
            await this.itemRepairInvoiceRepository.save(itemData);
        });
        const result = await this.repairInvoiceRepository.findOne({
            where: { id },
        });
        return result;
    }
    async findAll() {
        return await this.repairInvoiceRepository.find({
            relations: ["items", "task"],
        });
    }
    async getInvoiceByTaskId(id: string) {
        console.log(id);
        const result = await this.repairInvoiceRepository.findOne({
            where: {
                task: {
                    task_id: id,
                },
            },
            relations: {
                items: true,
                task: true,
            },
        });
        return result;
    }
    
}

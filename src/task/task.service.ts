import { Technician } from "./../technician/entities/technician.entity";
import { IdGenerator } from "../id-generator/id-generator.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Task, taskStatus } from "./entities/task.entity";
import { Floor } from "../floor/entities/floor.entity";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { isQueryAffected } from "../helper/validation";
import { Manager } from "src/manager/entities/manager.entity";
import { Resident } from "src/resident/entities/resident.entity";
import {
    Complain,
    complainStatus,
} from "src/complain/entities/complain.entity";
import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        @InjectRepository(Complain)
        private readonly complainRepository: Repository<Complain>,
        @InjectRepository(Technician)
        private readonly technicianRepository: Repository<Technician>,
        @InjectRepository(RepairInvoice)
        private readonly repairInvoiceRepository: Repository<RepairInvoice>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
    ) {}

    async create(
        assigneeId: string,
        createTaskDto: CreateTaskDto,
    ): Promise<Task | null> {
        try {
            const task_id = "T" + this.idGenerate.generateId();
            const assigner = (await this.managerRepository.findOne({
                where: { id: createTaskDto.assigner_id },
            })) as Manager;
            const complain = (await this.complainRepository.findOne({
                where: { complain_id: createTaskDto.complain_id },
            })) as Complain;
            const assignee = (await this.technicianRepository.findOne({
                where: {
                    id: assigneeId,
                },
            })) as Technician;
            const data = {
                task_id,
                assigner,
                complain,
                status: taskStatus.PROCESSING,
                assignee,
            };
            const taskData = this.taskRepository.create(data);
            await this.taskRepository.save(taskData);
            const result = await this.taskRepository.findOne({
                where: {
                    task_id,
                },
                relations: ["assignee", "assigner", "complain"]
            });
            await this.complainRepository.update(createTaskDto.complain_id, {
                status: complainStatus.RECEIVED,
            });
            console.log(result);
            return result;
        } catch (e) {
            throw new Error(e);
        }
    }

    async findAll() {
        return await this.taskRepository.find({
            relations: ["assignee", "assigner", "complain", "invoice"],
        });
    }

    async findOne(id: string) {
        return await this.taskRepository.findOne({
            where: { task_id: id },
            relations: ["assignee", "assigner", "complain"],
        });
    }

    async done(id: string): Promise<Task | null> {
        try {
            await this.taskRepository.update(id, {
                status: taskStatus.DONE,
            });
            const result = this.taskRepository.findOne({
                where: {
                    task_id: id,
                },
            });
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getTaskOfTechnician(id: string) {
        const result = await this.taskRepository.find({
            where: {
                assignee: {
                    id: id,
                },
            },
            relations: {
                assignee: true,
                assigner: {
                    account : true
                },
                complain: {
                    resident: true
                }
                ,invoice: true
                
            },withDeleted: true 
        });
        return result;
    }
}

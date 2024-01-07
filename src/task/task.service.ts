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
import { Admin } from "src/admin/entities/admin.entity";
@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
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
            let assigner:any;
            if(createTaskDto.assigner_id.includes("MNG")) {
                 assigner = (await this.managerRepository.findOne({
                    where: { id: createTaskDto.assigner_id },
                })) as Manager;
            }
            else
             assigner = (await this.adminRepository.findOne({
                where: { id: createTaskDto.assigner_id },
            })) as Admin;
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
                complain,    
                status: taskStatus.PROCESSING,
                assignee,
            };
            let newData;
            if(createTaskDto.assigner_id.includes("MNG")) {
                newData = {...data, manager: assigner}
            }
            else newData = {...data, admin: assigner}
            
            const taskData = this.taskRepository.create(newData);
            await this.taskRepository.save(taskData);
            const result = await this.taskRepository.findOne({
                where: {
                    task_id,
                },
                relations: ["assignee", "manager", "admin", "complain"]
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
            relations: ["assignee", "manager", "admin", "complain", "invoice"],
        });
    }

    async findOne(id: string) {
        return await this.taskRepository.findOne({
            where: { task_id: id },
            relations: {
                assignee: true,
                manager: true,
                admin: true,
                complain: {
                    resident: true
                },
                invoice:{
                    items: true 
                }
            }
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
                manager: {
                    account : true
                },
                admin: {
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

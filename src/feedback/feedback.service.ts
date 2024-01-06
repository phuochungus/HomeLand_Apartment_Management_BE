import { IdGenerator } from "../id-generator/id-generator.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, In, Repository, Like } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { StorageManager } from "../storage/storage.service";
import { IRepository } from "../helper/interface/IRepository.interface";
import { Feedback } from "./entities/feedback.entity";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { isQueryAffected } from "../helper/validation";
import { Building } from "src/building/entities/building.entity";
import { Apartment } from "src/apartment/entities/apartment.entity";
import { floor } from "lodash";
import { Service } from "src/service/entities/service.entity";
import { PersonRole } from "src/helper/class/profile.entity";
import { Resident } from "src/resident/entities/resident.entity";
export abstract class FeedbackService implements IRepository<Feedback> {
    findByServiceId(service: string) {
        throw new Error("Method not implemented.");
    }
    find(arg0: { where: { service: string; }; relations: string[]; }) {
        throw new Error("Method not implemented.");
    }
    abstract findOne(id: string): Promise<Feedback | null>;
    abstract update(id: string, updateEntityDto: any): Promise<boolean>;
    abstract delete(id: string): Promise<boolean>;
    abstract create(
        createPropertyDto: CreateFeedbackDto,
        id?: string,
    ): Promise<Feedback>;
    abstract updateFeedback(
        id: string,
        updateFloorDto: CreateFeedbackDto,
    ): Promise<Feedback>;
    abstract findAll(page?: number): Promise<Feedback[]>;
   
}

@Injectable()
export class TypeORMFeedbackService extends FeedbackService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(Feedback)
        private readonly feedbackRepository: Repository<Feedback>,
        @InjectRepository(Resident)
        private readonly residentRepository: Repository<Resident>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
    ) {
        super();
    }

    async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        const { rating, comment, resident_id, service_id } = createFeedbackDto;
        const resident = (await this.residentRepository.findOne({
            where: {
                id: resident_id,
            },
        })) as Resident;
        const service = (await this.serviceRepository.findOne({
            where: {
                service_id: service_id,
            },
        })) as Service;
        const feedback_id = "FDB" + this.idGenerate.generateId();
        const data = {
            feedback_id,
            resident_id,
            comment,
            rating,
            service_id,
            resident,
            service
        };
        const feedbackData = this.feedbackRepository.create(data);
        try {
            const feedback = await this.feedbackRepository.save(feedbackData);
            return feedback;
        } catch (error) {
            throw error;
        }
    }

    findOne(id: string) {
        return this.feedbackRepository.findOne({
            where: {
                feedback_id: id,
                
            },
            relations: ["service"],
            cache: true,
            withDeleted: true 
        });
    }
    async findAll() {
        return await this.feedbackRepository.find({
            relations: ["service","resident"],
            withDeleted: true 
        });
    }

    async findByServiceId(service_id: string): Promise<Feedback[]> {
        return await this.feedbackRepository.find({
            where: {
                service: {
                    service_id: service_id,
                },
            },
            relations: ["service", "resident"],
        });
    }
    async updateFeedback(
        id: string,
        updateFeedbackDto: UpdateFeedbackDto,
    ): Promise<Feedback> {
        let feedback = await this.feedbackRepository.findOne({
            where: { feedback_id: id },
        });
        if (!feedback) throw new NotFoundException();
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.startTransaction();
            // Perform transactional operations here

            await queryRunner.commitTransaction();
            await queryRunner.startTransaction();
            let { rating, ...rest } = updateFeedbackDto;
            if (feedback) {
                feedback = this.feedbackRepository.merge(feedback, updateFeedbackDto);
                feedback = await this.feedbackRepository.save(feedback);
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        return feedback;
    }
    async update(id: string, UpdateFeedbackDto: UpdateFeedbackDto) {
        let result = await this.feedbackRepository.update(id, UpdateFeedbackDto as any);
        return isQueryAffected(result);
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.feedbackRepository.softDelete({ feedback_id: id });
        return isQueryAffected(result);
    }
    async hardDelete?(id: any): Promise<boolean> {
        try {
            const result = await this.feedbackRepository.delete({ feedback_id : id });
            return isQueryAffected(result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /**
     *
     * @param query chuỗi cần tìm theo tên
     * @returns
     */
   
}

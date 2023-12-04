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
export abstract class FeedbackService implements IRepository<Feedback> {
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
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
    ) {
        super();
    }

    async create(
        CreateFloorDto: CreateFeedbackDto,
        id?: string,
    ): Promise<Feedback> {
        let feedback = this.feedbackRepository.create(CreateFloorDto);
        feedback.feedback_id = "FEB" + this.idGenerate.generateId();
        if (id) feedback.feedback_id = id;

        try {
            feedback = await this.feedbackRepository.save(feedback);
            return feedback;
        } catch (error) {
            console.error(error);
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
        });
    }
    async findAll() {
        return await this.feedbackRepository.find({
            relations: ["service"],
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

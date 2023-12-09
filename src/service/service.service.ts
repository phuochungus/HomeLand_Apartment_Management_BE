import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Service } from "./entities/service.entity";
import { DataSource, Repository, TypeORMError } from "typeorm";
import { IdGenerator } from "../id-generator/id-generator.service";
import { ApiConsumes } from "@nestjs/swagger";
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";
import { StorageError, StorageManager } from "../storage/storage.service";
import {
    isPromiseFulfilledResult,
    isPromiseFulfilledResultArray,
    isQueryAffected,
    newImageHaveStrangeURL,
} from "../helper/validation";
import { isString } from "class-validator";
import { difference } from "lodash";

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
        @InjectDataSource()
        private dataSource: DataSource,
        private storageManager: StorageManager,
        private readonly idGenerate: IdGenerator,
    ) {}
    async create(createServiceDto: CreateServiceDto, id?: string) {
        const { images, ...rest } = createServiceDto;
        let service = this.serviceRepository.create(rest);
        service.imageURLs = [];
        service.service_id = "SER" + this.idGenerate.generateId().toString();
        if (id) service.service_id = id;
        const queryRunner = this.dataSource.createQueryRunner();
        if (images) {
            let uploadResults: PromiseSettledResult<string>[] = [];

            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                uploadResults = await Promise.allSettled(
                    images.map((image) =>
                        this.storageManager.upload(
                            image.buffer,
                            `service/${service.service_id}/${Date.now()}.` +
                                (image.extension || "png"),
                            image.mimetype || "image/png",
                        ),
                    ),
                );
                if (!isPromiseFulfilledResultArray(uploadResults)) {
                    throw new StorageError("Some image upload failed");
                }
                service.imageURLs = uploadResults.map((result) => result.value);
                service = await this.serviceRepository.save(service);
                await queryRunner.commitTransaction();
                return await this.findOne(service.service_id);
            } catch (error) {
                await queryRunner.rollbackTransaction();
                await this.storageManager.remove(
                    uploadResults
                        .filter((r): r is PromiseFulfilledResult<string> =>
                            isPromiseFulfilledResult(r),
                        )
                        .map((r) => r.value),
                );

                console.error(error);
                throw error;
            } finally {
                await queryRunner.release();
            }
        }
        service = await this.serviceRepository.save(service);
        return await this.findOne(service.service_id);
    }

    async findAll(page?: number) {
        if (page != undefined && page != null && page > 0) {
            return await this.serviceRepository.find({
                skip: (page - 1) * 30,
                take: 30,
                relations: ["servicePackages"],
                cache: true,
            });
        }

        return await this.serviceRepository.find({
            relations: ["servicePackages"],
            cache: true,
        });
    }

    async findOne(id: string) {
        let service = await this.serviceRepository.findOne({
            where: {
                service_id: id,
            },
            cache: true,
            relations: ["servicePackages"],
        });
        if (service == null) throw new NotFoundException();
        return service;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto) {
        const { images, ...rest } = updateServiceDto;
        let uploadPaths: string[] = [];
        const queryRunnder = this.dataSource.createQueryRunner();
        try {
            queryRunnder.startTransaction();
            let { images, ...rest } = updateServiceDto;
            let service = await this.serviceRepository.preload({
                service_id: id,
                ...rest,
            });

            if (!service) throw new NotFoundException("Service Not found");

            if (images) {
                if (newImageHaveStrangeURL(images, service.imageURLs ?? []))
                    throw new BadRequestException("Detect strange URL");

                const newImages = await Promise.allSettled(
                    images.map((element, index) => {
                        if (isString(element)) return element;
                        const uploadPath = `service/${id}/${
                            index + Date.now() + (element.extension || ".png")
                        }`;
                        uploadPaths.push(uploadPath);
                        return this.storageManager.upload(
                            element.buffer,
                            uploadPath,
                            `image/${element.extension}` || ".png",
                        );
                    }),
                );

                if (!isPromiseFulfilledResultArray(newImages))
                    throw new StorageError("Some image upload failed");

                const newImageURLS = newImages.map((result) => result.value);
                // this task can be done in parallel, will enhance later
                await this.storageManager.remove(
                    difference(service.imageURLs, newImageURLS),
                );
                service.imageURLs = newImageURLS;
            }
            service = await this.serviceRepository.save(service);
            return true;
        } catch (error) {
            await queryRunnder.rollbackTransaction();
            if (uploadPaths.length > 0)
                await this.storageManager.remove(uploadPaths);
            console.error(error);
            throw error;
        } finally {
            await queryRunnder.release();
        }
    }

    async remove(id: string) {
        return await this.serviceRepository.softDelete({
            service_id: id,
        });
    }
}

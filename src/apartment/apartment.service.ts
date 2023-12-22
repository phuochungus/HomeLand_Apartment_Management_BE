import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { DataSource, In, Repository } from "typeorm";
import { Apartment } from "./entities/apartment.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { StorageError, StorageManager } from "../storage/storage.service";
import { IdGenerator } from "../id-generator/id-generator.service";
import { Resident } from "../resident/entities/resident.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import { difference, isString } from "lodash";
import { Client } from "elasticsearch";
import { Floor } from "../floor/entities/floor.entity";

/**
 * @classdesc Represent the service that manage the apartment
 * @abstract
 */
export abstract class ApartmentService {
    /**
     * @param id id of the apartment
     */
    abstract findOne(id: string): Promise<Apartment | null>;

    /**
     * @param id id of the apartment
     */
    abstract update(
        id: string,
        updateEntityDto: UpdateApartmentDto,
    ): Promise<boolean>;

    /**
     * @abstract
     * @param id id of the apartment
     */
    abstract delete(id: string): Promise<void>;
    /**
     *
     * @param createPropertyDto
     * @param id optional id of the apartment
     */
    abstract create(
        createPropertyDto: CreateApartmentDto,
        id?: string,
    ): Promise<Apartment>;

    abstract findAll(page?: number): Promise<Apartment[]>;
    abstract addResidentToApartment(
        residentIds: string[] | string,
        id: string,
    ): Promise<Apartment | null>;

    abstract search(
        field: string,
        value: string,
        from: number,
    ): Promise<Apartment[]>;
}

@Injectable()
export class ApartmentServiceImp extends ApartmentService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
        @InjectRepository(Resident)
        private readonly residentRepository: Repository<Resident>,
        @InjectRepository(Floor)
        private readonly floorRepository: Repository<Floor>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
        private readonly elasticSearchClient: Client,
    ) {
        super();
    }

    async create(
        createApartmentDto: CreateApartmentDto,
        id?: string,
    ): Promise<Apartment> {
        const { images, ...rest } = createApartmentDto;
        await this.checkIfReachMaxApartment(createApartmentDto.floor_id);
        let apartment = this.apartmentRepository.create(rest);
        apartment.apartment_id = "APM" + this.idGenerate.generateId();
        if (id) apartment.apartment_id = id;
        const queryRunnder = this.dataSource.createQueryRunner();
        let uploadResults: PromiseSettledResult<string>[] = [];
        try {
            await queryRunnder.connect();
            await queryRunnder.startTransaction();
            uploadResults = await Promise.allSettled(
                createApartmentDto.images.map((image, index) =>
                    this.storageManager.upload(
                        image.buffer,
                        `apartment/${apartment.apartment_id}/${
                            index.toString() + Date.now()
                        }`,
                        `image/${image.extension ?? "png"}`,
                    ),
                ),
            );

            if (!this.isPromiseFulfilledResultArray(uploadResults)) {
                throw new StorageError("Some image upload failed");
            }

            apartment.imageURLs = uploadResults.map((result) => result.value);

            if (createApartmentDto.residentIds) {
                const residents = await this.residentRepository.find({
                    where: { id: In(createApartmentDto.residentIds) },
                });
                if (residents.length !== createApartmentDto.residentIds.length)
                    throw new NotFoundException("Some resident not found");
                apartment.residents = residents;
            }

            apartment = await this.apartmentRepository.save(apartment);
            await queryRunnder.commitTransaction();
            return apartment;
        } catch (error) {
            await queryRunnder.rollbackTransaction();
            await this.storageManager.remove(
                uploadResults
                    .filter((r): r is PromiseFulfilledResult<string> =>
                        this.isPromiseFulfilledResult(r),
                    )
                    .map((r) => r.value),
            );

            console.error(error);
            throw error;
        } finally {
            await queryRunnder.release();
        }
    }

    async checkIfReachMaxApartment(floor_id: string) {
        const floor = await this.floorRepository.findOne({
            where: { floor_id },
            relations: ["apartments"],
        });
        if (!floor) throw new BadRequestException("Floor not found");
        if (
            floor.max_apartment &&
            floor.apartments.length >= floor.max_apartment
        )
            throw new ConflictException("Floor reach max apartment");
    }

    async findAll(page?: number) {
        if (page != undefined && page != null) {
            return await this.apartmentRepository.find({
                skip: (page - 1) * 30,
                take: 30,
                relations: {
                    residents: true,
                },
                withDeleted: true,
            });
        }

        return await this.apartmentRepository.find({ withDeleted: true });
    }

    async findOne(id: string) {
        return await this.apartmentRepository.findOne({
            where: { apartment_id: id },
            relations: ["residents"],
            withDeleted: true,
        });
    }

    async update(
        id: string,
        updateApartmentDto: UpdateApartmentDto,
    ): Promise<boolean> {
        let uploadPaths: string[] = [];
        const queryRunnder = this.dataSource.createQueryRunner();
        try {
            queryRunnder.startTransaction();
            let { images, ...rest } = updateApartmentDto;
            let apartment = await this.apartmentRepository.preload({
                apartment_id: id,
                ...rest,
            });

            if (!apartment) throw new NotFoundException("Apartment Not found");

            if (images) {
                if (this.newImageHaveStrangeURL(images, apartment.imageURLs))
                    throw new BadRequestException("Detect strange URL");

                const newImages = await Promise.allSettled(
                    images.map((element, index) => {
                        if (isString(element)) return element;
                        const uploadPath = `apartment/${id}/${
                            index + Date.now() + (element.extension || ".png")
                        }`;
                        uploadPaths.push(uploadPath);
                        return this.storageManager.upload(
                            element.buffer,
                            uploadPath,
                            `image/${element.extension ?? "png"}`,
                        );
                    }),
                );

                if (!this.isPromiseFulfilledResultArray(newImages))
                    throw new StorageError("Some image upload failed");

                const newImageURLS = newImages.map((result) => result.value);
                // this task can be done in parallel, will enhance later
                await this.storageManager.remove(
                    difference(apartment.imageURLs, newImageURLS),
                );
                apartment.imageURLs = newImageURLS;
            }
            apartment = await this.apartmentRepository.save(apartment);
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

    private isPromiseFulfilledResult<T>(
        result: PromiseSettledResult<T>,
    ): result is PromiseFulfilledResult<T> {
        return result.status === "fulfilled";
    }

    private isPromiseFulfilledResultArray<T>(
        results: PromiseSettledResult<T>[],
    ): results is PromiseFulfilledResult<T>[] {
        return results.every((result) => result.status === "fulfilled");
    }

    private newImageHaveStrangeURL(
        newImages: (string | MemoryStoredFile)[],
        oldImageURLS: string[],
    ) {
        const newImageURLS = newImages.filter((image): image is string =>
            isString(image),
        );

        if (difference(newImageURLS, oldImageURLS).length > 0) return true;
        return false;
    }

    async delete(id: string) {
        await this.apartmentRepository.softRemove({ apartment_id: id });
    }

    async addResidentToApartment(
        residentIds: string[] | string,
        id: string,
    ): Promise<Apartment | null> {
        try {
            const apartment = (await this.apartmentRepository.findOne({
                where: {
                    apartment_id: id,
                },
            })) as Apartment;
            await this.apartmentRepository
                .createQueryBuilder()
                .relation(Apartment, "residents")
                .of(apartment)
                .add(residentIds);
            const result = await this.apartmentRepository.findOne({
                where: {
                    apartment_id: id,
                },
                relations: ["residents"],
            });
            return result;
        } catch (e) {
            throw new Error(e);
        }
    }

    async search(
        field: string,
        value: string,
        from: number,
    ): Promise<Apartment[]> {
        let object = {};
        object[field] = value;
        let result = await this.elasticSearchClient.search<Apartment>({
            index: "apartment",
            body: {
                from: from,
                size: 30,
                query: {
                    match: object,
                },
            },
        });
        let finalResutl: Apartment[] = result.hits.hits.map(
            (hit) => hit._source,
        );
        return finalResutl;
    }
}

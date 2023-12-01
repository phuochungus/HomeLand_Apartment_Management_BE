import {
    BadRequestException,
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
import { IRepository } from "../helper/interface/IRepository.interface";
import { Resident } from "../resident/entities/resident.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import { difference, isString } from "lodash";
import { isQueryAffected } from "../helper/validation";

/**
 * @classdesc Represent the service that manage the apartment
 * @abstract
 */
export abstract class ApartmentService implements IRepository<Apartment> {
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
    abstract delete(id: string);
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
}

@Injectable()
export class ApartmentServiceImp extends ApartmentService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
        @InjectRepository(Resident)
        private readonly residentRepository: Repository<Resident>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
    ) {
        super();
    }

    async create(
        createApartmentDto: CreateApartmentDto,
        id?: string,
    ): Promise<Apartment> {
        const { images, ...rest } = createApartmentDto;
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
                            index + Date.now() + (image.extension || ".png")
                        }`,
                        `image/${image.extension}` || "image/png",
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

            // console.error(error);
            throw error;
        } finally {
            await queryRunnder.release();
        }
    }

    async findAll(page?: number) {
        if (page != undefined && page != null) {
            return await this.apartmentRepository.find({
                skip: (page - 1) * 30,
                take: 30,
            });
        }

        return await this.apartmentRepository.find();
    }

    async findOne(id: string) {
        return await this.apartmentRepository.findOne({
            where: { apartment_id: id },
        });
    }

    async update(
        id: string,
        updateApartmentDto: UpdateApartmentDto,
    ): Promise<boolean> {
        let uploadPaths: string[] = [];
        const queryRunnder = this.dataSource.createQueryRunner();
        let { images, ...rest } = updateApartmentDto;
        const result = await this.apartmentRepository.update(
            id,
            rest,
        );
        return isQueryAffected(result);
        
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
        return await this.apartmentRepository.softDelete({
            apartment_id: id,
        });
    }
}

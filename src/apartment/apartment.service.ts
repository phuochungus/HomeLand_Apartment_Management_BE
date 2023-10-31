import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { DataSource, In, Repository, TypeORMError } from "typeorm";
import { Apartment } from "./entities/apartment.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { StorageManager, UploadError } from "../storage/storage.service";
import { IdGenerator } from "../id-generator/id-generator.service";
import { IRepository } from "../helper/interface/IRepository.interface";
import { Resident } from "../resident/entities/resident.entity";
import { isQueryAffected } from "../helper/validation";
import { MemoryStoredFile } from "nestjs-form-data";

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
    ): Promise<Apartment>;

    /**
     * @abstract
     * @param id id of the apartment
     */
    abstract delete(id: string): Promise<boolean>;
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
        let uploadedImageURLs: string[] = [];
        try {
            await queryRunnder.connect();
            await queryRunnder.startTransaction();
            uploadedImageURLs = await Promise.all(
                createApartmentDto.images.map((image, index) =>
                    this.storageManager.upload(
                        image.buffer,
                        `apartment/${apartment.apartment_id}/${
                            index + Date.now() + ".png"
                        }`,
                        "image/png",
                    ),
                ),
            );

            apartment.imageURLs = uploadedImageURLs;

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
            if (error instanceof TypeORMError) {
                try {
                    await this.storageManager.remove(uploadedImageURLs);
                } catch (error) {
                    throw error;
                }
                throw error;
            }
            await queryRunnder.rollbackTransaction();
            console.error(error);
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
    ): Promise<Apartment> {
        const { images, ...rest } = updateApartmentDto;
        const queryRunnder = this.dataSource.createQueryRunner();
        let uploadedImageURLs: string[] = [];
        try {
            queryRunnder.startTransaction();
            let result = await this.apartmentRepository.update(id, rest);
            let apartment = await this.apartmentRepository.findOne({
                where: { apartment_id: id },
            });

            if (!apartment || !isQueryAffected(result))
                throw new NotFoundException("Apartment not found");
            let imageFiles = this.filterImageFiles(images);
            uploadedImageURLs = await Promise.all(
                imageFiles.map((image, index) =>
                    this.storageManager.upload(
                        image.buffer,
                        `apartment/${apartment!.apartment_id}/${
                            index + Date.now() + ".png"
                        }`,
                        "image/png",
                    ),
                ),
            );
            return apartment;
        } catch (error) {
            await queryRunnder.rollbackTransaction();
            if (error instanceof UploadError) console.error(error);
            if (error instanceof TypeORMError) {
                await this.storageManager.remove(uploadedImageURLs);
            }
            throw error;
        } finally {
            await queryRunnder.release();
        }
    }

    private filterImageFiles(
        array: (string | MemoryStoredFile)[],
    ): MemoryStoredFile[] {
        return array.filter(
            (element): element is MemoryStoredFile =>
                element instanceof MemoryStoredFile,
        );
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

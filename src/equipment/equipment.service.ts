import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { Equipment } from "./entities/equipment.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { IdGenerator } from "../id-generator/id-generator.service";
import { StorageError, StorageManager } from "../storage/storage.service";
import { Apartment } from "../apartment/entities/apartment.entity";
import { Floor } from "../floor/entities/floor.entity";
import { Building } from "../building/entities/building.entity";
import { isString } from "class-validator";
import { difference } from "lodash";
import { MemoryStoredFile } from "nestjs-form-data";

export abstract class EquipmentService {
    abstract create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment>;
    abstract findAll(page?: number): Promise<Equipment[]>;
    abstract findOne(id: string): Promise<Equipment>;
    abstract update(
        id: string,
        updateEquipmentDto: UpdateEquipmentDto,
    ): Promise<Equipment>;
    abstract remove(id: string): void;
}

@Injectable()
export class EquipmentServiceImp extends EquipmentService {
    constructor(
        @InjectRepository(Equipment)
        private readonly equipmentRepository: Repository<Equipment>,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        super();
    }

    async create(
        createEquipmentDto: CreateEquipmentDto,
        id?: string,
    ): Promise<Equipment> {
        let { images, ...rest } = createEquipmentDto;
        let equipment = this.equipmentRepository.create(rest);
        equipment.checkFK();

        const [apartment, floor, building] = await Promise.all([
            createEquipmentDto.apartment_id
                ? this.dataSource.getRepository(Apartment).findOneBy({
                      apartment_id: createEquipmentDto.apartment_id,
                  })
                : null,
            createEquipmentDto.floor_id
                ? this.dataSource
                      .getRepository(Floor)
                      .findOneBy({ floor_id: createEquipmentDto.floor_id })
                : null,
            createEquipmentDto.building_id
                ? this.dataSource.getRepository(Building).findOneBy({
                      building_id: createEquipmentDto.building_id,
                  })
                : null,
        ]);
        if (!apartment && !floor && !building)
            throw new BadRequestException(
                "apartment_id, floor_id, building_id not found",
            );

        if (id) equipment.id = id;
        else equipment.id = "EQM" + this.idGenerate.generateId();
        if (!(images && images.length > 0)) images = [];
        try {
            const imageURLs = await Promise.all(
                images.map((file, index) => {
                    return this.storageManager.upload(
                        file.buffer,
                        `equipment/${equipment.id}/${index + Date.now()}`,
                        `image/${file.extension ?? "png"}`,
                    );
                }),
            );
            equipment.imageURLs = imageURLs;
        } catch (error) {
            await this.storageManager.remove([`equipment/${equipment.id}`]);
            throw error;
        }
        return await this.equipmentRepository.save(equipment);
    }

    async findAll(page?: number): Promise<Equipment[]> {
        if (page) {
            return await this.equipmentRepository.find({
                skip: (page - 1) * 30,
                take: 30,
            });
        }
        return await this.equipmentRepository.find();
    }

    async findOne(id: string): Promise<Equipment> {
        const equipment = await this.equipmentRepository.findOne({
            where: { id },
        });
        if (equipment) return equipment;
        throw new NotFoundException("Equipment not found");
    }

    async update(
        id: string,
        updateEquipmentDto: UpdateEquipmentDto,
    ): Promise<Equipment> {
        let { images, ...rest } = updateEquipmentDto;
        let equipment = await this.equipmentRepository.preload({
            id,
            ...rest,
        });

        if (!equipment) throw new NotFoundException("Equipment not found");

        equipment.checkFK();

        let uploadPaths: string[] = [];
        try {
            if (images) {
                if (this.newImageHaveStrangeURL(images, equipment.imageURLs))
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
                            `image/${element.extension}` || ".png",
                        );
                    }),
                );

                if (!this.isPromiseFulfilledResultArray(newImages))
                    throw new StorageError("Some image upload failed");

                const newImageURLS = newImages.map((result) => result.value);
                // this task can be done in parallel, will enhance later
                await this.storageManager.remove(
                    difference(equipment.imageURLs, newImageURLS),
                );
                equipment.imageURLs = newImageURLS;
                return await this.equipmentRepository.save(equipment);
            }

            return equipment;
        } catch (error) {
            if (uploadPaths.length > 0)
                await this.storageManager.remove(uploadPaths);
            console.error(error);
            throw error;
        }
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

    async remove(id: string) {
        await this.equipmentRepository.softDelete({ id });
    }
}

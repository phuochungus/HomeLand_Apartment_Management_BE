import {
    BadRequestException,
    Injectable,
    NotImplementedException,
} from "@nestjs/common";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { Equipment } from "./entities/equipment.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { IdGenerator } from "../id-generator/id-generator.service";
import { StorageManager } from "../storage/storage.service";
import { Apartment } from "../apartment/entities/apartment.entity";
import { Floor } from "../floor/entities/floor.entity";
import { Building } from "../building/entities/building.entity";

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
        const { images, ...rest } = createEquipmentDto;
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
        try {
            const imageURLs = await Promise.all(
                images.map((file, index) => {
                    return this.storageManager.upload(
                        file.buffer,
                        `equipment/${equipment.id}/${
                            index + Date.now().toString()
                        }`,
                    );
                }),
            );
            equipment.imageURLs = imageURLs;
            return await this.equipmentRepository.save(equipment);
        } catch (error) {
            await this.storageManager.remove([`equipment/${equipment.id}`]);
            throw error;
        }
    }

    findAll(): Promise<Equipment[]> {
        throw new NotImplementedException();
    }

    findOne(id: String): Promise<Equipment> {
        throw new NotImplementedException();
    }

    update(
        id: string,
        updateEquipmentDto: UpdateEquipmentDto,
    ): Promise<Equipment> {
        throw new NotImplementedException();
    }

    remove(id: string) {
        throw new NotImplementedException();
    }
}

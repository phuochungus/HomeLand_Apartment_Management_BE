import { Injectable, NotImplementedException } from "@nestjs/common";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { Equipment } from "./entities/equipment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IdGenerator } from "../id-generator/id-generator.service";

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
    ) {
        super();
    }

    async create(
        createEquipmentDto: CreateEquipmentDto,
        id?: string,
    ): Promise<Equipment> {
        const { images, ...rest } = createEquipmentDto;
        let equipment = this.equipmentRepository.create(rest);
        if (id) equipment.id = id;
        else equipment.id = "EQM" + this.idGenerate.generateId();

        return await this.equipmentRepository.save(equipment);
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

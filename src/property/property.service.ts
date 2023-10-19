import { Injectable } from "@nestjs/common";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { BaseRepository } from "../helper/base";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";
import { isQueryAffected } from "../helper/validation";
import { InjectRepository } from "@nestjs/typeorm";

export abstract class PropertyRepository extends BaseRepository<
    CreatePropertyDto,
    Property
> {}
@Injectable()
export class PropertyService extends PropertyRepository {
    constructor(
        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
    ) {
        super();
    }

    create(createPropertyDto: CreatePropertyDto) {
        let property =
            this.propertyRepository.create(createPropertyDto);

        return Promise.resolve(property);
    }

    async findAll() {
        return await this.propertyRepository.find();
    }

    async findOne(id: string) {
        return await this.propertyRepository.findOne({
            where: { property_id: id },
        });
    }

    async update(id: string, updatePropertyDto: UpdatePropertyDto) {
        const result = await this.propertyRepository.update(
            { property_id: id },
            updatePropertyDto,
        );
        return isQueryAffected(result);
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.propertyRepository.softDelete({
            property_id: id,
        });
        return isQueryAffected(result);
    }
}

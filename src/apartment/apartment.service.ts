import { Injectable } from "@nestjs/common";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { BaseRepository } from "../helper/base";
import { Repository } from "typeorm";
import { Apartment } from "./entities/apartment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { isQueryAffected } from "../helper/validation";

export abstract class ApartmentRepository extends BaseRepository<
    CreateApartmentDto,
    Apartment
> {}
@Injectable()
export class ApartmentService extends ApartmentRepository {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
    ) {
        super();
    }

    create(createPropertyDto: CreateApartmentDto) {
        let property =
            this.apartmentRepository.create(createPropertyDto);

        return Promise.resolve(property);
    }

    async findAll() {
        return await this.apartmentRepository.find();
    }

    async findOne(id: string) {
        return await this.apartmentRepository.findOne({
            where: { apartment_id: id },
        });
    }

    async update(id: string, updatePropertyDto: UpdateApartmentDto) {
        const result = await this.apartmentRepository.update(
            { apartment_id: id },
            updatePropertyDto,
        );
        return isQueryAffected(result);
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.apartmentRepository.softDelete({
            apartment_id: id,
        });
        return isQueryAffected(result);
    }
}

import { Injectable } from "@nestjs/common";
import { CreateServicePackageDto } from "./dto/create-service-package.dto";
import { UpdateServicePackageDto } from "./dto/update-service-package.dto";
import { ServicePackage } from "./entities/service-package.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IdGenerator } from "../id-generator/id-generator.service";
import { isQueryAffected } from "../helper/validation";

@Injectable()
export class ServicePackageService {
    constructor(
        @InjectRepository(ServicePackage)
        private servicePackageRepository: Repository<ServicePackage>,
        private readonly idGenerate: IdGenerator,
    ) {}
    async create(
        createServicePackageDto: CreateServicePackageDto,
        id?: string,
    ) {
        let servicePackage = this.servicePackageRepository.create(
            createServicePackageDto,
        );
        servicePackage.servicePackage_id =
            "SP" + this.idGenerate.generateId().toString();
        if (id) servicePackage.servicePackage_id = id;
        return await this.servicePackageRepository.save(servicePackage);
    }

    async findAll() {
        return await this.servicePackageRepository.find({
            relations: ["service"],
            cache: true,
        });
    }

    async findOne(id: string) {
        return await this.servicePackageRepository.findOne({
            where: {
                servicePackage_id: id,
            },
            relations: ["service"],
            cache: true,
        });
    }

    async update(id: string, updateServicePackageDto: UpdateServicePackageDto) {
        try {
            let result = await this.servicePackageRepository.update(
                id,
                updateServicePackageDto,
            );
            return isQueryAffected(result);
        } catch (error) {
            throw new Error("Update failed due to " + error.message);
        }
    }

    async remove(id: string) {
        return await this.servicePackageRepository.softDelete({
            servicePackage_id: id,
        });
    }
}

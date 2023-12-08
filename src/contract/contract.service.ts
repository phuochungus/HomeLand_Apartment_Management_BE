import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { DataSource, Like, Repository, TypeORMError } from "typeorm";
import { Contract } from "./entities/contract.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { isQueryAffected } from "../helper/validation";
import { IdGenerator } from "../id-generator/id-generator.service";
import { StorageManager } from "../storage/storage.service";
import { ContractRole, ContractStatusRole } from "../helper/enums/contractEnum";

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(Contract)
        private contractRepository: Repository<Contract>,
        @InjectDataSource()
        private dataSource: DataSource,
        private storageManager: StorageManager,
        private readonly idGenerate: IdGenerator,
    ) {}
    async create(createContract: CreateContractDto, id?: string) {
        const { ...rest } = createContract;
        let contract = this.contractRepository.create(rest);

        contract.contract_id = "CT" + this.idGenerate.generateId().toString();
        if (id) contract.contract_id = id;
        await this.contractRepository.save(contract);
        return await this.findOne(contract.contract_id);
    }

    async findAll(page?: number) {
        if (page != undefined && page != null && page > 0) {
            return await this.contractRepository.find({
                skip: (page - 1) * 30,
                take: 30,
                relations: ["resident", "apartment"],
                cache: true,
            });
        }

        return await this.contractRepository.find({
            relations: ["resident", "apartment"],
            cache: true,
        });
    }

    async findOne(id: string): Promise<Contract> {
        let contract = await this.contractRepository.findOne({
            where: {
                contract_id: id,
            },
            cache: true,
            relations: ["resident", "apartment"],
        });
        if (contract == null) throw new NotFoundException();
        return contract;
    }

    async update(id: string, updateContractDto: UpdateContractDto) {
        const { imageUpdate, ...rest } = updateContractDto;
        let contract = this.contractRepository.create(rest);

        const queryRunner = this.dataSource.createQueryRunner();

        if (imageUpdate) {
            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();
                const imageURL = await this.storageManager.upload(
                    imageUpdate.buffer,
                    `contract/${id}/${Date.now()}.` +
                        (imageUpdate.extension || "png"),
                    imageUpdate.mimetype || "image/png",
                );
                contract.contract_id = id;
                contract.contract_with_signature_photo_URL = imageURL;
                contract.status = ContractStatusRole.ACTIVE;
                contract = await this.contractRepository.save(contract);
                await queryRunner.commitTransaction();
            } catch (error) {
                if (error instanceof TypeORMError) {
                    try {
                        await this.storageManager.remove([
                            `contract/${id}/${Date.now()}.` +
                                (imageUpdate.extension || "png"),
                            imageUpdate.mimetype || "image/png",
                        ]);
                    } catch (error) {
                        console.error(error);
                    }
                }
                throw error;
            } finally {
                await queryRunner.release();
            }
        }
        let result = await this.contractRepository.update(
            { contract_id: id },
            { ...contract },
        );

        return await isQueryAffected(result);
    }

    async remove(id: string) {
        return await this.contractRepository.softDelete({
            contract_id: id,
        });
    }
    async search(query: string): Promise<Contract[]> {
        console.log(query);
        const result = await this.contractRepository.find({
            where: {
                resident: { profile: {name:Like(`%${query}%`)} },
            },
        });

        return result;
    }
    
}

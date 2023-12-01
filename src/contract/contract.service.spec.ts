import { Test, TestingModule } from "@nestjs/testing";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { Contract } from "./entities/contract.entity";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DataSource, DeleteResult, Repository, UpdateResult } from "typeorm";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { ContractRole, ContractStatusRole } from "../helper/enums/contractEnum";
import { CreateContractDto } from "./dto/create-contract.dto";
import { readFileSync } from "fs";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { NotFoundException } from "@nestjs/common";

describe("ContractService", () => {
    let service: ContractService;
    let repository: Repository<Contract>;
    const mockDeleteResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };
    const mockUpdateResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };
    const image = {
        extension:"jpg",
        mimetype:"image/jpeg",
        buffer: readFileSync(process.cwd() + "/src/seed/room.jpg"),
    } as MemoryStoredFile;

    const mockContract = {
        contract_id: "CT001",
        apartment_id: "123",
        resident_id: "123",
        role: ContractRole.RENT,
        status: ContractStatusRole.INACTIVE,
        expire_at: new Date("2030-01-01"),
    } as Contract;
    const CONTRACT_REPOSITORY_TOKEN = getRepositoryToken(Contract);

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                NestjsFormDataModule.config({
                    isGlobal: true,
                }),

                TypeOrmModule.forRootAsync({
                    useFactory: async () => {
                        if (process.env.IS_PRODUCTION == "true") {
                            return {
                                type: "postgres",
                                url: process.env.DB_URL,
                                synchronize: true,
                                entities: ["dist/**/*.entity{.ts,.js}"],
                                cache: {
                                    duration: 5000,
                                    type: "redis",
                                    options: {
                                        url: process.env.REDIS_URL,
                                    },
                                },
                            };
                        } else {
                            return {
                                type: "postgres",
                                url: process.env.DB_LOCAL_URL,
                                synchronize: true,
                                entities: ["dist/**/*.entity{.ts,.js}"],
                                duration: 5000,
                                cache: {
                                    type: "redis",
                                    options: {
                                        url: process.env.REDIS_LOCAL_URL,
                                    },
                                },
                            };
                        }
                    },
                }),
                TypeOrmModule.forFeature([Contract]),
                AuthModule,
                StorageModule,
                IdGeneratorModule,
                JwtModule,
                Repository<Contract>,
            ],

            providers: [ContractService, JwtService],
        }).compile();
        repository = module.get<Repository<Contract>>(
            CONTRACT_REPOSITORY_TOKEN,
        );

        service = module.get<ContractService>(ContractService);
    }, 30000);

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("get Contracts", () => {
        it("should find contract by id", async () => {
            jest.spyOn(repository, "findOne").mockImplementation(
                async () => mockContract,
            );
            const result = await service.findOne(mockContract.contract_id);
            expect(result).toEqual(mockContract);
        });

        it("should find all contract", async () => {
            jest.spyOn(repository, "find").mockImplementation(async () => [
                mockContract,
            ]);
            const result = await service.findAll();
            expect(result).toEqual([mockContract]);
        });
        it("should find all contract with page", async () => {
            jest.spyOn(repository, "find").mockImplementation(async () => [
                mockContract,
            ]);
            const result = await service.findAll(1);
            expect(result).toEqual([mockContract]);
        });
    });
    describe("create contract", () => {
        it("should create new Contract success", async () => {
            jest.spyOn(repository, "create").mockImplementation((dto) => {
                return {
                    contract_id: dto.contract_id,
                    apartment_id: dto.apartment_id,
                    resident_id: dto.resident_id,
                    expire_at: dto.expire_at,
                    role: dto.role,
                    status: dto.status,
                } as Contract;
            });
            jest.spyOn(repository, "save").mockImplementation(async (dto) => {
                return {
                    contract_id: dto.contract_id,
                    apartment_id: dto.apartment_id,
                    resident_id: dto.resident_id,
                    expire_at: dto.expire_at,
                    role: dto.role,
                    status: dto.status,
                } as Contract;
            });
            const result = await service.create(
                {
                    apartment_id: mockContract.apartment_id,
                    resident_id: mockContract.resident_id,
                    expire_at: mockContract.expire_at,
                    role: mockContract.role,
                    status: mockContract.status,
                } as CreateContractDto,
                mockContract.contract_id,
            );
            expect(result).toEqual({
                contract_id: expect.any(String),
                apartment_id: mockContract.apartment_id,
                resident_id: mockContract.resident_id,
                expire_at: mockContract.expire_at,
                role: mockContract.role,
                status: mockContract.status,
            });
        });

        it("should create new contract fail", async () => {
            try {
                const result = await service.create(
                    {
                        apartment_id: mockContract.apartment_id,
                        resident_id: mockContract.resident_id,
                        expire_at: mockContract.expire_at,
                        role: mockContract.role,
                        status: mockContract.status,
                    } as CreateContractDto,
                    mockContract.contract_id,
                );
            } catch (err) {
                expect(err.message).toBe(
                    'No metadata for "Contract" was found.',
                );
            }
        });
    });
    describe("Update contract", () => {
        it("should update Contract success", async () => {
            jest.spyOn(repository, "update").mockImplementation(async () => {
                return mockUpdateResult;
            });
            const result = await service.update(
                mockContract.contract_id,
                mockContract as CreateContractDto,
            );
            expect(result).toEqual(true);
        });
        // it("should update Contract success with image", async () => {
        //     jest.spyOn(repository, "update").mockImplementation(async () => {
        //         return mockUpdateResult;
        //     });
        //     console.log(image);
        //     const result = await service.update(mockContract.contract_id, {
        //         ...(mockContract as CreateContractDto),
        //         imageUpdate: image,
        //     } as UpdateContractDto);
        //     expect(result).toEqual(true);
        // });
    });
    describe("Delete contract", () => {
        it("should delete Contract success", async () => {
            jest.spyOn(repository, "softDelete").mockImplementation(
                async () => {
                    return mockDeleteResult;
                },
            );
            const result = await service.remove(mockContract.contract_id);
            expect(result).toEqual(mockDeleteResult);
        });
    });
});

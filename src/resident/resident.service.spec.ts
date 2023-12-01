import { Test, TestingModule } from "@nestjs/testing";

import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { INestApplication, NotFoundException } from "@nestjs/common";
import { random } from "lodash";
import { Resident } from "./entities/resident.entity";
import { Account } from "../account/entities/account.entity";
import { ResidentController } from "./resident.controller";
import { ResidentService } from "./resident.service";
import { faker } from "@faker-js/faker";
import { Gender } from "../helper/class/profile.entity";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { ResolveFnOutput } from "module";
import { StorageModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";
import multer from "multer";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";
import { AccountService } from "../account/account.service";
describe("ResidentController", () => {
    let service: ResidentService;
    let accountService: AccountService;
    let residentRepository: Repository<Resident>;
    let accountRepository: Repository<Account>;

    const mockDeleteResult: DeleteResult = {
        raw: [],
        affected: 1,
    };
    const mockUpdateResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };

    const mockResidentaHasAccount = {
        id: "resident",
        profile: {
            date_of_birth: new Date(2022),
            name: "vobinh",
            gender: Gender.MALE,
            phone_number: "0978754723",
            front_identify_card_photo_URL: "resident/frontIdentifyPhoto.jpg",
            back_identify_card_photo_URL: "resident/backIdentifyPhoto.jpg",
        },
        account: {
            owner_id: "resident",
            email: "resident@gmail.com",
            password: "0978754723",
            avatarURL: "resident/avatar.svg",
        },
    } as Resident;
    const RESIDENT_REPOSITORY_TOKEN = getRepositoryToken(Resident);
    const ACCOUNT_REPOSITORY_TOKEN = getRepositoryToken(Account);
    const mockAccount = {
        owner_id: "resident",
        email: "resident@gmail.com",
        password: "0978754723",
        avatarURL: "resident/avatar.svg",
    } as Account
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
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
                TypeOrmModule.forFeature([Resident, Account]),
                IdGeneratorModule,
                StorageModule,
                HashModule,
                AvatarGeneratorModule,
                Repository<Resident>,
                Repository<Account>,
            ],

            providers: [ResidentService, AccountService],
        }).compile();
        residentRepository = module.get<Repository<Resident>>(
            RESIDENT_REPOSITORY_TOKEN,
        );
        accountRepository = module.get<Repository<Account>>(
            ACCOUNT_REPOSITORY_TOKEN,
        );
        service = module.get<ResidentService>(ResidentService);
        accountService = module.get<AccountService>(AccountService);
    }, 30000);

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    it("should repository be defined", () => {
        expect(residentRepository).toBeDefined();
    });
    describe("resident", () => {
        it("should find resident by id", async () => {
            jest.spyOn(residentRepository, "findOne").mockImplementation(
                async () => mockResidentaHasAccount,
            );
            const result = await service.findOne(mockResidentaHasAccount.id);
            expect(result).toEqual(mockResidentaHasAccount);
        });
        it("should find all resident", async () => {
            jest.spyOn(residentRepository, "find").mockImplementation(
                async () => [mockResidentaHasAccount],
            );
            const result = await service.findAll();
            expect(result).toEqual([mockResidentaHasAccount]);
        });
        // it("should create new resident with avatar photo", async () => {
        //     jest.spyOn(residentRepository, "create").mockImplementation(
        //         (dto: CreateResidentDto) => {
        //             return {
        //                 id: "fdsfds",
        //                 profile: {
        //                     date_of_birth: dto.date_of_birth,
        //                     name: dto.name,
        //                     gender: dto.gender,
        //                     phone_number: dto.phone_number,
        //                     front_identify_card_photo_URL:
        //                         "resident/frontIdentifyPhoto.jpg",
        //                     back_identify_card_photo_URL:
        //                         "resident/backIdentifyPhoto.jpg",
        //                 },
        //                 account: {
        //                     owner_id: "resident",
        //                     email: "resident@gmail.com",
        //                     password: dto.phone_number,
        //                     avatarURL: "resident/avatar.svg",
        //                 },
        //             } as Resident;
        //         },
        //     );
        //     jest.spyOn(residentRepository, "save").mockImplementation(
        //         async (dto:Resident) => {
        //             return {
        //                 id: "fdsfds",
        //                 profile: {
        //                     date_of_birth: dto.profile.date_of_birth,
        //                     name: dto.profile.name,
        //                     gender: dto.profile.gender,
        //                     phone_number: dto.profile.phone_number,
        //                     front_identify_card_photo_URL:
        //                         "resident/frontIdentifyPhoto.jpg",
        //                     back_identify_card_photo_URL:
        //                         "resident/backIdentifyPhoto.jpg",
        //                 },
        //                 account: {
        //                     owner_id: "resident",
        //                     email: "resident@gmail.com",
        //                     password: dto.profile.phone_number,
        //                     avatarURL: "resident/avatar.svg",
        //                 },
        //             } as Resident;
        //         },
        //     );
        //     const result = await service.create({
        //         date_of_birth: new Date(2022),
        //         name: "vobinh",
        //         gender: Gender.MALE,
        //         phone_number: "0978754723",
        //         front_identify_card_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three'),
        //           } as MemoryStoredFile,
                  
        //         back_identify_card_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three')
        //           } as MemoryStoredFile,
        //         avatar_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three')
        //           } as MemoryStoredFile,
        //     });
        //     expect(result).toEqual({
        //         id: expect.any(String),
        //         profile: {
        //             date_of_birth: new Date(2022),
        //             name: "vobinh",
        //             gender: Gender.MALE,
        //             phone_number: "0978754723",
        //             front_identify_card_photo_URL:
        //                 "resident/frontIdentifyPhoto.jpg",
        //             back_identify_card_photo_URL:
        //                 "resident/backIdentifyPhoto.jpg",
        //         },
        //         account: {
        //             owner_id: "resident",
        //             email: "resident@gmail.com",
        //             password: "0978754723",
        //             avatarURL: "resident/avatar.svg",
        //         },
        //     });
        // }, 30000);
        it("should create new resident with error photo", async () => {
            jest.spyOn(residentRepository, "create").mockImplementation(
                (dto: CreateResidentDto) => {
                    return {
                        id: "fdsfds",
                        profile: {
                            date_of_birth: dto.date_of_birth,
                            name: dto.name,
                            gender: dto.gender,
                            phone_number: dto.phone_number,
                            front_identify_card_photo_URL:
                                "resident/frontIdentifyPhoto.jpg",
                            back_identify_card_photo_URL:
                                "resident/backIdentifyPhoto.jpg",
                        },
                        account: {
                            owner_id: "resident",
                            email: "resident@gmail.com",
                            password: dto.phone_number,
                            avatarURL: "resident/avatar.svg",
                        },
                    } as Resident;
                },
            );
            const err = new Error("Can not create resident");
            jest.spyOn(residentRepository, "save").mockRejectedValue(err)
             
            await expect(service.create({
                date_of_birth: new Date(2022),
                name: "vobinh",
                gender: Gender.MALE,
                phone_number: "0978754723",
                front_identify_card_photo: {
                    mimetype: 'text/csv',
                    buffer: Buffer.from('one,two,three'),
                  } as MemoryStoredFile,
                  
                back_identify_card_photo: {
                    mimetype: 'text/csv',
                    buffer: Buffer.from('one,two,three')
                  } as MemoryStoredFile,
                avatar_photo: {
                    mimetype: 'text/csv',
                    buffer: Buffer.from('one,two,three')
                  } as MemoryStoredFile,
            })).rejects.toThrow(err)
        }, 30000);
        // it("should create new resident with avata photo and create new account with email", async () => {
        //     jest.spyOn(residentRepository, "create").mockImplementation(
        //         (dto: CreateResidentDto) => {
        //             return {
        //                 id: "fdsfds",
        //                 profile: {
        //                     date_of_birth: dto.date_of_birth,
        //                     name: dto.name,
        //                     gender: dto.gender,
        //                     phone_number: dto.phone_number,
        //                     front_identify_card_photo_URL:
        //                         "resident/frontIdentifyPhoto.jpg",
        //                     back_identify_card_photo_URL:
        //                         "resident/backIdentifyPhoto.jpg",
        //                 },
        //                 account: {
        //                     owner_id: "resident",
        //                     email: "resident@gmail.com",
        //                     password: dto.phone_number,
        //                     avatarURL: "resident/avatar.svg",
        //                 },
        //             } as Resident;
        //         },
        //     );
        //     jest.spyOn(residentRepository, "save").mockImplementation(
        //         async (dto:Resident) => {
        //             return {
        //                 id: "fdsfds",
        //                 profile: {
        //                     date_of_birth: dto.profile.date_of_birth,
        //                     name: dto.profile.name,
        //                     gender: dto.profile.gender,
        //                     phone_number: dto.profile.phone_number,
        //                     front_identify_card_photo_URL:
        //                         "resident/frontIdentifyPhoto.jpg",
        //                     back_identify_card_photo_URL:
        //                         "resident/backIdentifyPhoto.jpg",
        //                 },
        //                 account: {
        //                     owner_id: "resident",
        //                     email: "resident@gmail.com",
        //                     password: dto.profile.phone_number,
        //                     avatarURL: "resident/avatar.svg",
        //                 },
        //             } as Resident;
        //         },
        //     );
        //     jest.spyOn(accountRepository, "save").mockImplementation(
        //         async (dto) => {
        //             return mockAccount;
        //         },
        //     );
        //     jest.spyOn(accountRepository, "findOne").mockImplementation(
        //         async (id) => {
        //             return mockAccount;
        //         },
        //     );
        //     const resultAccount = await accountRepository.save(mockAccount)
        //     expect(resultAccount).toEqual(mockAccount);
        //     const result = await service.create({
        //         date_of_birth: new Date(2022),
        //         name: "vobinh",
        //         gender: Gender.MALE,
        //         phone_number: "0978754723",
        //         front_identify_card_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three'),
        //           } as MemoryStoredFile,
                  
        //         back_identify_card_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three')
        //           } as MemoryStoredFile,
        //         avatar_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three')
        //           } as MemoryStoredFile,
        //           email: "resident@gmail.com"
        //     });
        //     expect(result).toEqual({
        //         id: expect.any(String),
        //         profile: {
        //             date_of_birth: new Date(2022),
        //             name: "vobinh",
        //             gender: Gender.MALE,
        //             phone_number: "0978754723",
        //             front_identify_card_photo_URL:
        //                 "resident/frontIdentifyPhoto.jpg",
        //             back_identify_card_photo_URL:
        //                 "resident/backIdentifyPhoto.jpg",
        //         },
        //         account: {
        //             owner_id: "resident",
        //             email: "resident@gmail.com",
        //             password: "0978754723",
        //             avatarURL: "resident/avatar.svg",
        //         },
        //     });
        // }, 30000);

        // it("should create new resi fail", async () => {
        //     const err = new BadRequestException("Create fail");
        //     jest.spyOn(service, "create").mockRejectedValue(err);
        //     await expect(service.create).rejects.toThrow(err);
        // });
        it("should update ", async () => {
            jest.spyOn(residentRepository, "update").mockImplementation(
                async (id, dto) => {
                    return mockUpdateResult;
                },
            );
            const result = await service.update("resident", {
                phone_number: "0905091074",
            });
            expect(result).toEqual(mockUpdateResult);
        });
        it("should update success resident without avata photo", async () => {
            jest.spyOn(residentRepository, "findOne").mockImplementation(
                async (id) => {
                    return mockResidentaHasAccount;
                },
            );
            jest.spyOn(residentRepository, "save").mockImplementation(
                async (dto) => {
                    return mockResidentaHasAccount;
                },
            );
            jest.spyOn(accountRepository, "save").mockImplementation(
                async (dto) => {
                    return mockAccount;
                },
            );
            jest.spyOn(accountRepository, "findOne").mockImplementation(
                async (id) => {
                    return mockAccount;
                },
            );
            const result = await service.updateResident("resident", {
                phone_number: "0905091074",
            });
            const resultAccount = await accountRepository.save(mockAccount)
            expect(resultAccount).toEqual(mockAccount);
            expect(result).toEqual(mockResidentaHasAccount);
        });
        // it("should update success resident with avata photo", async () => {
        //     jest.spyOn(residentRepository, "findOne").mockImplementation(
        //         async (id) => {
        //             return mockResidentaHasAccount;
        //         },
        //     );
        //     jest.spyOn(residentRepository, "save").mockImplementation(
        //         async (dto) => {
        //             return mockResidentaHasAccount;
        //         },
        //     );
        //     jest.spyOn(accountRepository, "save").mockImplementation(
        //         async (dto) => {
        //             return mockAccount;
        //         },
        //     );
        //     jest.spyOn(accountRepository, "findOne").mockImplementation(
        //         async (id) => {
        //             return mockAccount;
        //         },
        //     );
        //     const result = await service.updateResident("resident", {
        //         phone_number: "0905091074",
        //         avatar_photo: {
        //             mimetype: 'text/csv',
        //             buffer: Buffer.from('one,two,three')
        //           } as MemoryStoredFile
        //     });
        //     const resultAccount = await accountRepository.save(mockAccount)
        //     expect(resultAccount).toEqual(mockAccount);
        //     expect(result).toEqual(mockResidentaHasAccount);
        // });
        // it("should update building fail because id not found", async () => {
        //     try {
        //         const result = await service.update("", mockBuilding);
        //     } catch (e) {
        //         expect(e.message).toBe("Id not found.");
        //     }
        // });
        it("should search resident", async () => {
            jest.spyOn(residentRepository, "find").mockImplementation(
                async () => [mockResidentaHasAccount],
            );
            const result = await service.search("binh");
            expect(result).toEqual([mockResidentaHasAccount]);
        });
        it("should delete success resident", async () => {
            jest.spyOn(residentRepository, "softDelete").mockImplementation(
                async () => {
                    return mockUpdateResult;
                },
            );
            const result = await service.delete("resident");
            expect(result).toEqual(mockUpdateResult);
        });
        it("should delete new resident fail ", async () => {
            const err = new Error("Can not delete resident")
            jest.spyOn(residentRepository, "softDelete").mockRejectedValue(err);
            await expect(service.delete).rejects.toThrow(err);
        });
    });
});

import { MeController } from "./../me/me.controller";
import { ApartmentService, ApartmentServiceImp } from "./apartment.service";
import { ApartmentController } from "./apartment.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeORMTestingModule } from "../../test-utils/TypeORMTestingModule";
import { Apartment, ApartmentStatus } from "./entities/apartment.entity";
import { Floor } from "../floor/entities/floor.entity";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { Repository, UpdateResult, DeleteResult, DataSource } from "typeorm";
import {
    BadRequestException,
    INestApplication,
    NotFoundException,
} from "@nestjs/common";
import { AppModule } from "../app.module";
import { faker, id_ID } from "@faker-js/faker";
import { UpdateApartmentDto } from "./dto/update-apartment.dto";
import { mock } from "node:test";
import { CreateAccountDto } from "src/account/dto/create-account.dto";
import { promiseHooks } from "v8";
import { error } from "console";
import { Resident } from "../resident/entities/resident.entity";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../storage/storage.module";
import { JwtModule } from "@nestjs/jwt";
import { IdGenerator } from "src/id-generator/id-generator.service";
describe("ApartmentService", () => {
    let service: ApartmentServiceImp;
    let ApartmentRepository: Repository<Apartment>;
    let storageManager: StorageManager;
    const mockApartmentService = {
        findAll: jest.fn().mockImplementation(() => [mockApartment]),
        create: jest.fn().mockImplementation((dto) => {
            return {
                building_id: "BLD1",
                max_floor: dto.max_floor,
                name: dto.name,
                apartment_id: "fdvs",
                width: dto.width,
                length: dto.length,
                number_of_bedroom: dto.number_of_bedroom,
                number_of_bathroom: dto.number_of_bathroom,
                rent: dto.rent,
                description: "string",
                floor_id: "FLR1",
            };
        }),
        findOne: jest.fn().mockImplementation(() => mockApartment),
        update: jest.fn().mockImplementation(() => {
            return mockUpdateResult;
        }),
        search: jest.fn().mockImplementation((query) => [mockApartment]),
        delete: jest.fn().mockImplementation((id) => {
            return mockUpdateResult;
        }),
    };
    const mockApartment = {
        apartment_id: "APM3",
        width: 20,
        length: 20,
        number_of_bedroom: 2,
        number_of_bathroom: 2,
        rent: 5000000,
        description: "string",
        floor_id: "FLR1",
        building_id: "BLD1",
        name: "Apartment 3",
    } as Apartment;
    const mockUpdateResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };
    const APARTMENT_REPOSITORY_TOKEN = getRepositoryToken(Apartment);
    beforeEach(async () => {
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
                                entities: ["src/**/*.entity{.ts,.js}"],
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
                                entities: ["src/**/*.entity{.ts,.js}"],
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
                TypeOrmModule.forFeature([Resident, Apartment]),
                IdGeneratorModule,
                AuthModule,
                StorageModule,
                JwtModule,
            ],
            providers: [ApartmentServiceImp],
        }).compile();

        ApartmentRepository = module.get<Repository<Apartment>>(
            APARTMENT_REPOSITORY_TOKEN,
        );
        service = module.get<ApartmentServiceImp>(ApartmentServiceImp);
    }, 50000);
    it("should service be defined", () => {
        expect(service).toBeDefined();
    });
    it("should repository be defined", () => {
        expect(ApartmentRepository).toBeDefined();
    });
    describe("Delete", () => {
        it("should delete success apartment", async () => {
            jest.spyOn(ApartmentRepository, "softDelete").mockImplementation(
                async () => {
                    return mockUpdateResult;
                },
            );
            const result = await service.delete("BLD3");
            expect(result).toEqual(mockUpdateResult);
        });
    });
    describe("find", () => {
        it("should return all apartments", async () => {
            const apartments = [
                {
                    apartment_id: "APM3",
                    building_id: "BLD1",
                    description: "string",
                    floor_id: "FLR1",
                    length: 20,
                    name: "Apartment 3",
                    number_of_bathroom: 2,
                    number_of_bedroom: 2,
                    rent: 5000000,
                    width: 20,
                },
            ];
            jest.spyOn(ApartmentRepository, "find").mockResolvedValue(
                mockApartmentService.findAll(),
            );

            const result = await service.findAll();

            expect(result).toEqual(mockApartmentService.findAll());
        });

        it("should return all apartments by page", async () => {
            const apartments = [
                {
                    apartment_id: "APM3",
                    building_id: "BLD1",
                    description: "string",
                    floor_id: "FLR1",
                    length: 20,
                    name: "Apartment 3",
                    number_of_bathroom: 2,
                    number_of_bedroom: 2,
                    rent: 5000000,
                    width: 20,
                },
            ];
            const apartmentFindSpy = jest
                .spyOn(ApartmentRepository, "find")
                .mockResolvedValue(mockApartmentService.findAll());

            const result = await service.findAll(1);

            expect(result).toEqual(mockApartmentService.findAll());
        });
        it("should find Apartment by id", async () => {
            jest.spyOn(ApartmentRepository, "findOne").mockImplementation(
                async () => mockApartment,
            );
            const result = await service.findOne(mockApartment.apartment_id);
            expect(result).toEqual(mockApartment);
        });
    });
    describe("Create", () => {
        it("should create new Aparment", async () => {

            jest.spyOn(ApartmentRepository, "create").mockImplementation(
                (dto) => {
                    return {
                        apartment_id: faker.string.binary(),
                        building_id: "BLD1",
                        name: dto.name,
                        width: dto.width,
                        length: dto.length,
                        number_of_bedroom: dto.number_of_bedroom,
                        number_of_bathroom: dto.number_of_bathroom,
                        rent: dto.rent,
                        description: "string",
                        floor_id: "FLR1",

                    } as Apartment;
                },
            )
            jest.spyOn(ApartmentRepository, "save").mockImplementation(
                async (dto) => {
                    return {
                        apartment_id: faker.string.binary(),
                        building_id: "BLD1",
                        name: dto.name,
                        width: dto.width,
                        length: dto.length,
                        number_of_bedroom: dto.number_of_bedroom,
                        number_of_bathroom: dto.number_of_bathroom,
                        rent: dto.rent,
                        description: "string",
                        floor_id: "FLR1",

                    } as Apartment;
                },
            )

            const result = await service.create({
                building_id: mockApartment.building_id,
                name: mockApartment.name,
                width: mockApartment.width,
                length: mockApartment.length,
                number_of_bedroom: mockApartment.number_of_bedroom,
                number_of_bathroom: mockApartment.number_of_bathroom,
                rent: mockApartment.rent,
                description: mockApartment.description,
                floor_id: mockApartment.floor_id,
                images: []
            });
            expect(result).toEqual({
                apartment_id: expect.any(String),
                building_id: mockApartment.building_id,
                name: mockApartment.name,
                width: mockApartment.width,
                length: mockApartment.length,
                number_of_bedroom: mockApartment.number_of_bedroom,
                number_of_bathroom: mockApartment.number_of_bathroom,
                rent: mockApartment.rent,
                description: mockApartment.description,
                floor_id: mockApartment.floor_id,


            });
        });
        it("should create new Apartment with no residents", async () => {
            const dto: CreateApartmentDto = {
                images: [],
                name: "",
                width: 0,
                length: 0,
                number_of_bedroom: 0,
                number_of_bathroom: 0,
                rent: 0,
                description: "",
                floor_id: "",
                building_id: ""
            };

            const expectedApartment: Apartment = {
                apartment_id: "",
                name: "",
                width: 0,
                length: 0,
                number_of_bedroom: 0,
                number_of_bathroom: 0,
                rent: 0,
                status: ApartmentStatus.ACTIVE,
                description: "",
                floor_id: "",
                building_id: "",
                imageURLs: [],
                created_at: new Date(),

                max_floor: undefined,
                find: undefined
            };

            jest.spyOn(ApartmentRepository, "create").mockImplementation(() => expectedApartment);
            jest.spyOn(ApartmentRepository, "save").mockResolvedValueOnce(expectedApartment);

            const result = await service.create(dto);
            expect(result).toEqual(expectedApartment);
            expect(result.residents).toBeUndefined();
        });
        it("should create new apartment fail", async () => {
            const err = new BadRequestException("Some image upload failed");
            jest.spyOn(service, "create").mockRejectedValue(err);
            await expect(service.create).rejects.toThrow(err);
        });
        it('should throw an error when residentIds is an empty array', async () => {
            const dto: CreateApartmentDto = {
                images: [],
                name: "",
                width: 0,
                length: 0,
                number_of_bedroom: 0,
                number_of_bathroom: 0,
                rent: 0,
                description: "",
                floor_id: "",
                building_id: "",
                residentIds: [],
            };

            try {
                await service.create(dto);

                fail('Expected an error but none was thrown');
            } catch (error) {

                expect(error.message).toContain('foreign key constraint');

            }
        });
    });
    describe("Update", () => {
        it("should update success building", async () => {
            jest.spyOn(ApartmentRepository, "update").mockImplementation(
                async () => {
                    return mockUpdateResult;
                },
            );

            const result = await service.update(
                mockApartment.apartment_id,
                mockApartment,
            );
            expect(result).toEqual(true);
        });
        it("should update building fail because id not found", async () => {
            try {
                jest.spyOn(ApartmentRepository, "update")
                    .mockImplementation(async () => {
                        return mockUpdateResult;
                    })
                    .mockRejectedValue(new NotFoundException("Apartment Not found"));
                expect(await service.update("", mockApartment)).rejects.toThrow(
                    new NotFoundException("Apartment Not found"),
                );
            } catch (e) {
                expect(e.message).toBe("Apartment Not found");
            }
        });



    });
    describe('isPromiseFulfilledResult', () => {
        it('should return true if the promise is fulfilled', () => {
            const fulfilledPromise: PromiseFulfilledResult<any> = {
                status: 'fulfilled',
                value: 'test',
            };

            const result = (service as any).isPromiseFulfilledResult(fulfilledPromise as any);

            expect(result).toBe(true);
        });

        it('should return false if the promise is rejected', () => {
            const rejectedPromise: PromiseRejectedResult = {
                status: 'rejected',
                reason: 'test',
            };

            const result = (service as any).isPromiseFulfilledResult(rejectedPromise as any);

            expect(result).toBe(false);
        });

    });
    describe('newImageHaveStrangeURL', () => {
        it('should return false if there are no new images', () => {
            const newImages: (string | MemoryStoredFile)[] = [];
            const oldImageURLS = ['http://example.com/image1.png'];

            const result = (service as any).newImageHaveStrangeURL(newImages, oldImageURLS);

            expect(result).toBe(false);
        });

        it('should return true if at least one new image has a strange URL', () => {
            const newImages = [
                'http://example.com/image2.png',
                'http://example.com/image3.png',
                'http://strange-url.com/image4.png',
            ];
            const oldImageURLS = ['http://example.com/image1.png'];

            const result = (service as any).newImageHaveStrangeURL(newImages, oldImageURLS);

            expect(result).toBe(true);
        });
    });
});

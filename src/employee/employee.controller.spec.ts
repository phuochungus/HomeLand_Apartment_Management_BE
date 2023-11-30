
import { Test, TestingModule } from "@nestjs/testing";

import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { INestApplication, NotFoundException } from "@nestjs/common";
import { random } from "lodash";
import { Employee } from "./entities/employee.entity";
import { EmployeeController } from "./employee.controller";
import { EmployeeRepository, EmployeeService } from "./employee.service";
import { faker } from "@faker-js/faker";
import { Gender } from "../helper/class/profile.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../storage/storage.module";
import { JwtModule } from "@nestjs/jwt";
import { readFileSync } from "fs";

describe("EmployeeController", () => {
    let controller: EmployeeController;
    const mockUpdateResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };
    const image = {
        buffer: readFileSync(process.cwd() + "/src/seed/room.jpg"),
    } as MemoryStoredFile;

    const mockEmployee = {
        id: "emloyee",
       
        profile: {
            date_of_birth: new Date(2022),
            name: "vobinh",
            gender: Gender.MALE,
            phone_number: "0978754723",
            front_identify_card_photo_URL: "emloyee/frontIdentifyPhoto.jpg",
            back_identify_card_photo_URL: "emloyee/backIdentifyPhoto.jpg",
            
        },
        profilePictureURL: "emloyee/profilePicture.jpg",
      } as Employee;
      
    const mockEmployeeService = {
      findOne: jest.fn().mockResolvedValue(mockEmployee).mockResolvedValue(new NotFoundException),
        findAll: jest.fn().mockImplementation(() => [mockEmployee]),
        create: jest.fn().mockImplementation((dto:CreateEmployeeDto) => {
            return {
                id: "fdsfds",
                profile: {
                    date_of_birth: dto.date_of_birth,
                    name: dto.name,
                    gender: dto.gender,
                    phone_number: dto.phone_number,
                    front_identify_card_photo_URL: "employee/frontIdentifyPhoto.jpg",
                    back_identify_card_photo_URL: "employee/backIdentifyPhoto.jpg",
                },
                profilePictureURL: "emloyee/profilePicture.jpg",
                role: "employee",
            };
        }),
        // findOne: jest.fn().mockImplementation((id) => mockEmployee),
        updateEmployee: jest.fn().mockImplementation((id, dto) => {
            return {
                id: "employee",
                profile: {
                    date_of_birth: mockEmployee.profile.date_of_birth,
                    name: mockEmployee.profile.name,
                    gender: mockEmployee.profile.gender,
                    phone_number: dto.phone_number,
                    front_identify_card_photo_URL:mockEmployee.profile.front_identify_card_photo_URL,
                    back_identify_card_photo_URL: mockEmployee.profile.back_identify_card_photo_URL,
                },
                profilePictureURL: "emloyee/profilePicture.jpg",
                role: "employee",
            }
        }),
        search: jest.fn().mockImplementation((query) => [mockEmployee]),
        delete: jest.fn().mockImplementation((id) => {
            return mockUpdateResult;
        }),
    };
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
                TypeOrmModule.forFeature([Employee]),
                AuthModule,
                StorageModule,
                IdGeneratorModule,
                JwtModule,
            
            ],
            controllers: [EmployeeController],
            providers: [
              EmployeeService,
              {
                provide: EmployeeRepository,
                useValue: mockEmployeeService,
                // useValue: {
                //   find: jest.fn().mockResolvedValue([]),
                //   findOne: jest.fn().mockResolvedValue(new Employee()),
                //   findAll: jest.fn().mockResolvedValue([new Employee()]),
                //   create: jest.fn().mockResolvedValue(new Employee()),
                //   updateEmployee: jest.fn().mockResolvedValue(new Employee()),
                //   delete: jest.fn().mockResolvedValue({ affected: 1 }),
                  
                // },
              },
            ],
        })
            .overrideProvider(EmployeeService)
            .useValue(mockEmployeeService)
            .compile();
        controller = module.get<EmployeeController>(EmployeeController);
    }, 30000);

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
    describe("employee", () => {
      it("should find employee by id", async () => {
        const result = await controller.findOne(mockEmployee.id);
        expect(mockEmployeeService.findOne).toHaveBeenCalledWith(mockEmployee.id);
      //  expect(result).toEqual(mockEmployee);
      });
        it("should not find employee by id", async () => {
            const err = new Error("employee not found");
            jest.spyOn(mockEmployeeService, "findOne").mockRejectedValue(err);
            await expect(controller.findOne("")).rejects.toThrow(err);
        });
        it("should find all employee", async () => {
            const result = await controller.findAll();
            // expect(buildingRepository.findOne).toHaveBeenCalledWith(mockBuilding.building_id)
            expect(result).toEqual([mockEmployee]);
            expect(mockEmployeeService.findAll).toHaveBeenCalled();
        });
       
        it("should not find all employee", async () => {
            const err = new Error("employee not found");
            jest.spyOn(mockEmployeeService, "findAll").mockRejectedValue(err);
            await expect(controller.findAll()).rejects.toThrow(err);
        });
        it("should create new employee", async () => {
            const result = await controller.create({
                    date_of_birth: new Date(2022),
                    name: "vobinh",
                    gender: Gender.MALE,
                    phone_number: "0978754723",
                    front_identify_card_photo: new MemoryStoredFile(),
                    back_identify_card_photo: new MemoryStoredFile(),
                   
            });
            expect(result).toEqual({
                id: expect.any(String),
                profile: {
                    date_of_birth: new Date(2022),
                    name: "vobinh",
                    gender: Gender.MALE,
                    phone_number: "0978754723",
                    front_identify_card_photo_URL: "employee/frontIdentifyPhoto.jpg",
                    back_identify_card_photo_URL: "employee/backIdentifyPhoto.jpg",
                },
                profilePictureURL: "emloyee/profilePicture.jpg",
                role: "employee",
            });
        });
        it("should update success employee", async () => {
            const result = await controller.updateEmployee("employee", {
              phone_number: "0905091074",
              front_identify_card_photo: new MemoryStoredFile,
              back_identify_card_photo: new MemoryStoredFile
            });
            expect(result).toEqual({
              id: "employee",
              profile: {
                date_of_birth: mockEmployee.profile.date_of_birth,
                name: mockEmployee.profile.name,
                gender: mockEmployee.profile.gender,
                phone_number: "0905091074",
                front_identify_card_photo_URL: mockEmployee.profile.front_identify_card_photo_URL,
                back_identify_card_photo_URL: mockEmployee.profile.back_identify_card_photo_URL,
              },
              profilePictureURL: "emloyee/profilePicture.jpg",
              role: "employee",
            });
        });
        it("should delete success employee", async () => {
            const result = await controller.remove("employee");
            expect(result).toEqual(mockUpdateResult);
        });
        it("should delete fail employee", async () => {
            const mError = new Error("Resident not found to delete");
            jest.spyOn(mockEmployeeService, "delete").mockRejectedValue(mError);
            await expect(controller.remove("")).rejects.toThrow(
                mError,
            );
        });
    });
});
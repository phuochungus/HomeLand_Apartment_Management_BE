import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRepository, EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { StorageManager } from '../storage/storage.service';
import { Gender, PersonRole, Profile } from "../helper/class/profile.entity";
import { HashService } from '../hash/hash.service';
import { AvatarGenerator } from '../avatar-generator/avatar-generator.service';
import { IdGenerator } from '../id-generator/id-generator.service';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { IdGeneratorModule } from '../id-generator/id-generator.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('EmployeeController', () => {

        let service: EmployeeService;
        let EmployeeRepository: Repository<Employee>;
        const mockDeleteResult: DeleteResult = {
                raw: [],
                affected: 1,
        };
        const mockUpdateResult: UpdateResult = {
                raw: [],
                affected: 1,
                generatedMaps: [],
        };

        const mockEmployeeRepository = {
                create: jest.fn().mockReturnValue(Employee),
                save: jest.fn().mockReturnValue(Employee),
                findOne: jest.fn().mockReturnValue(Employee),
                find: jest.fn().mockReturnValue([Employee]),
                update: jest.fn().mockReturnValue(true),
                delete: jest.fn().mockReturnValue(true),
        };

        const mockStorageManager = {
                upload: jest.fn().mockReturnValue({
                        // url: 'http://localhost:54321',
                        // key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
                }),
                delete: jest.fn().mockReturnValue(true),
        };

        const mockHashService = {
                hash: jest.fn().mockReturnValue('mock-hash'),
                compare: jest.fn().mockReturnValue(true),
        };

        const mockAvatarGenerator = {
                generate: jest.fn().mockReturnValue('mock-avatar'),
        };

        const mockIdGenerator = {
                generate: jest.fn().mockReturnValue('mock-id'),
        };

        const mockDataSource = {
                buffer: jest.fn().mockReturnValue('mock-buffer'),
                mimetype: 'mock-mimetype',
        };

        const mockEmployee = {
                id: "employee",
                profile: {
                        date_of_birth: new Date(),
                        name: "Dinh Dai Duong",
                        gender: Gender.MALE,
                        phone_number: "0326465520",
                        front_identify_card_photo_URL: "employee/frontIdentifyPhoto.jpg",
                        back_identify_card_photo_URL: "employee/backIdentifyPhoto.jpg",
                },

        } as Employee;


        const EMPLOYEE_REPOSITORY_TOKEN = getRepositoryToken(Employee);

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
                                Repository<Employee>,

                        ],
                        providers: [EmployeeService, JwtService,

                                {
                                        provide: StorageManager,
                                        useValue: mockStorageManager,
                                },
                                {
                                        provide: HashService,
                                        useValue: mockHashService,
                                },
                                {
                                        provide: AvatarGenerator,
                                        useValue: mockAvatarGenerator,
                                },
                                {
                                        provide: IdGenerator,
                                        useValue: mockIdGenerator,
                                },
                                {
                                        provide: DataSource,
                                        useValue: mockDataSource,
                                }],
                }).compile();

                EmployeeRepository = module.get<Repository<Employee>>(EMPLOYEE_REPOSITORY_TOKEN);
                service = module.get<EmployeeService>(EmployeeService);
        }, 30000);

        it('should be defined', () => {
                expect(service).toBeDefined();
        });
        it("should repository be defined", () => {
                expect(EmployeeRepository).toBeDefined();
        });
        describe("employee",() => {
                it("should find employee by id", async () => {
                        jest.spyOn(EmployeeRepository, "findOne").mockImplementation(
                                async () => mockEmployee,
                        );
                        const result = await service.findOne(mockEmployee.id);
                        console.log(result);
                        expect(result).toEqual(mockEmployee);
                });
                it("should find all employee", async () => {
                        jest.spyOn(EmployeeRepository, "find").mockImplementation(
                                async () => [mockEmployee],
                        );
                        const result = await service.findAll();
                        console.log(result);
                        expect(result).toEqual([mockEmployee]);
                });
                it("should create new Employee with avata photo", async () => {
                        jest.spyOn(EmployeeRepository, "create").mockImplementation(
                                (entityLike: DeepPartial<Employee>) => {
                                        return {
                                                id: "fdsfds",
                                                profile: {
                                                        date_of_birth: entityLike.profile?.date_of_birth,
                                                        name: entityLike.profile?.name,
                                                        gender: entityLike.profile?.gender,
                                                        phone_number: entityLike.profile?.phone_number,
                                                        front_identify_card_photo_URL: "employee/frontIdentifyPhoto.jpg",
                                                        back_identify_card_photo_URL: "employee/backIdentifyPhoto.jpg",
                                                },
                                        } as Employee;
                                },
                        );
                        jest.spyOn(EmployeeRepository, "save").mockImplementation(
                                async (dto: Employee) => {
                                        return {
                                                id: "fdsfds",
                                                profile: {
                                                        date_of_birth: dto.profile.date_of_birth,
                                                        name: dto.profile.name,
                                                        gender: dto.profile.gender,
                                                        phone_number: dto.profile.phone_number,
                                                        front_identify_card_photo_URL:
                                                                "employee/frontIdentifyPhoto.jpg",
                                                        back_identify_card_photo_URL:
                                                                "employee/backIdentifyPhoto.jpg",
                                                },

                                        } as Employee;
                                },
                        );
                        const result = await service.create({
                                date_of_birth: new Date(),
                                name: "Dinh Dai Duong",
                                gender: Gender.MALE,
                                phone_number: "0326465520",
                                front_identify_card_photo: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three'),
                                } as MemoryStoredFile,

                                back_identify_card_photo: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three')
                                } as MemoryStoredFile,
                                profile_picture: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three')
                                } as MemoryStoredFile,
                                task_info: '',
                                identify_number: ''
                        });
                        expect(result).toEqual({
                                id: expect.any(String),
                                profile: {
                                        date_of_birth: new Date(),
                                        name: "Dinh Dai Duong",
                                        gender: Gender.MALE,
                                        phone_number: "0326465520",
                                        front_identify_card_photo_URL:
                                                "employee/frontIdentifyPhoto.jpg",
                                        back_identify_card_photo_URL:
                                                "employee/backIdentifyPhoto.jpg",
                                },

                        });
                }, 30000);
                it("should create new employee with error photo", async () => {
                        jest.spyOn(EmployeeRepository, "create").mockImplementation(
                                (entityLike: DeepPartial<Employee>) => {
                                  return {
                                    id: "fdsfds",
                                    profile: {
                                      date_of_birth: entityLike.profile?.date_of_birth,
                                      name: entityLike.profile?.name,
                                      gender: entityLike.profile?.gender,
                                      phone_number: entityLike.profile?.phone_number,
                                      front_identify_card_photo_URL: "employee/frontIdentifyPhoto.jpg",
                                      back_identify_card_photo_URL: "employee/backIdentifyPhoto.jpg",
                                    },
                                  } as Employee;
                                },
                              );
                        const err = new Error("Can not create resident");
                        jest.spyOn(EmployeeRepository, "save").mockRejectedValue(err)

                        await expect(service.create({
                                date_of_birth: new Date(2022),
                                name: "Dinh Dai Duong",
                                gender: Gender.MALE,
                                phone_number: "0326465520",
                                front_identify_card_photo: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three'),
                                } as MemoryStoredFile,

                                back_identify_card_photo: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three')
                                } as MemoryStoredFile,
                                profile_picture: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three')
                                } as MemoryStoredFile,
                                task_info: '',
                                identify_number: ''
                        })).rejects.toThrow(err)
                }, 30000);
                it("should create an employee", async () => {
                        const result = await service.create({
                                date_of_birth: new Date(),
                                name: "Dinh Dai Duong",
                                gender: Gender.MALE,
                                phone_number: "0326465520",
                                front_identify_card_photo: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three'),
                                } as MemoryStoredFile,
                                back_identify_card_photo: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three')
                                } as MemoryStoredFile,
                                profile_picture: {
                                        mimetype: 'text/csv',
                                        buffer: Buffer.from('one,two,three')
                                } as MemoryStoredFile,
                                task_info: '',
                                identify_number: ''
                        });
                      
                        expect(result).toEqual({
                                id: expect.any(String),
                                profile: {
                                        date_of_birth: new Date(2022),
                                        name: "Dinh Dai Duong",
                                        gender: Gender.MALE,
                                        phone_number: "0326465520",
                                        front_identify_card_photo_URL:
                                                "employee/frontIdentifyPhoto.jpg",
                                        back_identify_card_photo_URL:
                                                "employee/backIdentifyPhoto.jpg",
                                },
        
                        });
                      });
                // const result = await service.create({
                //         date_of_birth: new Date(),
                //         name: "Dinh Dai Duong",
                //         gender: Gender.MALE,
                //         phone_number: "0326465520",
                //         front_identify_card_photo: {
                //                 mimetype: 'text/csv',
                //                 buffer: Buffer.from('one,two,three'),
                //         } as MemoryStoredFile,

                //         back_identify_card_photo: {
                //                 mimetype: 'text/csv',
                //                 buffer: Buffer.from('one,two,three')
                //         } as MemoryStoredFile,
                //         profile_picture: {
                //                 mimetype: 'text/csv',
                //                 buffer: Buffer.from('one,two,three')
                //         } as MemoryStoredFile,

                // });
               
        },);

        // it("should create new resi fail", async () => {
        //     const err = new BadRequestException("Create fail");
        //     jest.spyOn(service, "create").mockRejectedValue(err);
        //     await expect(service.create).rejects.toThrow(err);
        // });
        it("should update ", async () => {
                jest.spyOn(EmployeeRepository, "update").mockImplementation(
                        async (id, dto) => {
                                return mockUpdateResult;
                        },
                );
                const result = await service.update("employee", {
                        phone_number: "0905091074",
                        front_identify_card_photo: new MemoryStoredFile,
                        back_identify_card_photo: new MemoryStoredFile
                });
                expect(result).toEqual(mockUpdateResult);
        });
        it("should update success resident without avata photo", async () => {
                jest.spyOn(EmployeeRepository, "findOne").mockImplementation(
                        async (id) => {
                                return mockEmployee;
                        },
                );
                jest.spyOn(EmployeeRepository, "save").mockImplementation(
                        async (dto) => {
                                return mockEmployee;
                        },
                );

                const result = await service.updateEmployee("employee", {
                        phone_number: "0905091074",
                        front_identify_card_photo: new MemoryStoredFile,
                        back_identify_card_photo: new MemoryStoredFile
                });

                expect(result).toEqual(mockEmployee);
        });
        it("should update success resident with avata photo", async () => {
                jest.spyOn(EmployeeRepository, "findOne").mockImplementation(
                        async (id) => {
                                return mockEmployee;
                        },
                );
                jest.spyOn(EmployeeRepository, "save").mockImplementation(
                        async (dto) => {
                                return mockEmployee;
                        },
                );

                const result = await service.updateEmployee("resident", {
                        phone_number: "0905091074",
                        profile_picture: {
                                mimetype: 'text/csv',
                                buffer: Buffer.from('one,two,three')
                        } as MemoryStoredFile,
                        front_identify_card_photo: new MemoryStoredFile,
                        back_identify_card_photo: new MemoryStoredFile
                });

                expect(result).toEqual(mockEmployee);
        });
        // it("should update building fail because id not found", async () => {
        //     try {
        //         const result = await service.update("", mockBuilding);
        //     } catch (e) {
        //         expect(e.message).toBe("Id not found.");
        //     }
        // });
        it("should search resident", async () => {
                jest.spyOn(EmployeeRepository, "find").mockImplementation(
                        async () => [mockEmployee],
                );
                const result = await service.findOne("Duong");
                expect(result).toEqual([mockEmployee]);
        });
        it("should delete success employee", async () => {
                jest.spyOn(EmployeeRepository, "softDelete").mockImplementation(
                        async () => {
                                return mockUpdateResult;
                        },
                );
                const result = await service.delete("employee");
                expect(result).toEqual(mockUpdateResult);
        });
        it("should delete new employee fail ", async () => {
                const err = new Error("Can not delete employee")
                jest.spyOn(EmployeeRepository, "softDelete").mockRejectedValue(err);
                await expect(service.delete).rejects.toThrow(err);
        });
});

import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Floor } from "../floor/entities/floor.entity";
import { Building } from "../building/entities/building.entity";
import { StorageManager } from "../storage/storage.service";
import { faker } from "@faker-js/faker";
import { Gender } from "../helper/class/profile.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import { Admin } from "../admin/entities/admin.entity";
import { IdGenerator } from "../id-generator/id-generator.service";
import { HashService } from "../hash/hash.service";
import { AvatarGenerator } from "../avatar-generator/avatar-generator.service";
import { ApartmentService } from "../apartment/apartment.service";
import { Resident } from "../resident/entities/resident.entity";
import { Manager } from "../manager/entities/manager.entity";
import { Technician } from "../technician/entities/technician.entity";
import { ResidentRepository } from "../resident/resident.service";
import { Contract } from "src/contract/entities/contract.entity";

import { ContractRole, ContractStatusRole } from "../helper/enums/contractEnum";
import { Service } from "../service/entities/service.entity";
import { ServicePackage } from "../service-package/entities/service-package.entity";
import { Client } from "elasticsearch";
import { BuildingService } from "../building/building.service";
import { FloorService } from "../floor/floor.service";
import { Apartment } from "../apartment/entities/apartment.entity";
import {
    Equipment,
    EquipmentStatus,
} from "../equipment/entities/equipment.entity";
import { EquipmentService } from "../equipment/equipment.service";
import { Employee } from "src/employee/entities/employee.entity";
import { Invoice } from "../invoice/entities/invoice.entity";
import { ServicePackageService } from "../service-package/service-package.service";
import { ServiceService } from "../service/service.service";
import exp from "constants";
import { InvoiceService } from "../invoice/invoice.service";
@Injectable()
export class SeedService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly storageManager: StorageManager,
        private readonly idGenerator: IdGenerator,
        private readonly hashService: HashService,
        private readonly avatarGenerator: AvatarGenerator,
        private readonly elasticsearchClient: Client,
        private readonly residentService: ResidentRepository,
        private readonly buildingService: BuildingService,
        private readonly apartmentService: ApartmentService,
        private readonly floorService: FloorService,
        private readonly equipmentService: EquipmentService,
        private readonly servicePackageService: ServicePackageService,
        private readonly serviceService: ServiceService,
        private readonly invoiceService: InvoiceService,
    ) {}

    async dropDB() {
        try {
            await this.storageManager.destroyStorage();
            await this.dataSource.dropDatabase();
            await this.elasticsearchClient.indices.delete({
                index: "apartment",
            });
            await this.elasticsearchClient.indices.create({
                index: "apartment",
                method: "PUT",
            });
        } catch (error) {
            console.error(error);
            // throw error;
        }
    }
    async createDB() {
        try {
            await this.storageManager.initiateStorage();
            await this.dataSource.synchronize();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    private readonly NUMBER_OF_BUILDING = 5;
    private readonly NUMBER_OF_FLOOR_PER_BUILDING = 5;
    private readonly NUMBER_OF_APARTMENT_PER_FLOOR = 6;
    private readonly NUMBER_OF_RESIDENT = 1;

    private readonly NUMBER_OF_EMPLOYEE = 10;
    private readonly NUMBER_OF_MANAGER = 10;
    private readonly NUMBER_OF_TECHNICIAN = 10;
    private readonly NUMBER_OF_ADMIN = 2;
    private readonly NUMBER_OF_Service = 5;
    private readonly NUMBER_OF_ServicePackage_PER_SERVICE = 5;

    private readonly frontIdentity = {
        buffer: readFileSync(process.cwd() + "/src/seed/front.jpg"),
    } as MemoryStoredFile;

    private readonly backIdentity = {
        buffer: readFileSync(process.cwd() + "/src/seed/back.jpg"),
    } as MemoryStoredFile;
    private readonly pool = {
        buffer: readFileSync(process.cwd() + "/src/seed/pool.jpg"),
    } as MemoryStoredFile;
    private readonly gym = {
        buffer: readFileSync(process.cwd() + "/src/seed/gym.jpg"),
    } as MemoryStoredFile;
    private readonly library = {
        buffer: readFileSync(process.cwd() + "/src/seed/library.jpg"),
    } as MemoryStoredFile;
    private readonly parking = {
        buffer: readFileSync(process.cwd() + "/src/seed/parking.jpg"),
    } as MemoryStoredFile;

    private readonly images = [
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room.jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (2).jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (3).jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (4).jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (5).jpg"),
        } as MemoryStoredFile,
    ];

    private buildings: Building[] = [];
    private floors: Floor[] = [];
    private apartments: Apartment[] = [];
    private equipments: Equipment[] = [];

    async startSeeding() {
        await this.createDemoAdmin();
        await this.createDemoTechnician();
        await this.createDemoAccountResident();

        this.buildings = await this.createDemoBuildings();
        await this.createDemoManager();

        this.floors = await this.createDemoFloors(this.buildings);
        this.apartments = await this.createDemoApartments(this.floors);
        this.equipments = await this.createDemoEquipments(
            this.buildings,
            this.floors,
            this.apartments,
        );
        await this.createDemoEmployees();
        await this.createDemoContract();
        await this.createDemoServices();
        await this.createDemoServicePackages();
        await this.createDemoResidents();
        await this.createDemoInvoices();
    }

    async createDemoEquipments(
        buildings: Building[],
        floors: Floor[],
        apartments: Apartment[],
    ): Promise<Equipment[]> {
        let equipments: Equipment[] = [];

        let thangmayImage = {
            buffer: readFileSync(process.cwd() + "/src/seed/thangmay.jpg"),
        } as MemoryStoredFile;
        for (let building of buildings) {
            for (let i = 0; i < 3; i++)
                equipments.push(
                    await this.equipmentService.create({
                        name: "Thang may",
                        images: [thangmayImage],
                        description: "Thang may",
                        building_id: building.building_id,
                        status: EquipmentStatus.AVAILABLE,
                    }),
                );
        }

        let cambienkhoiImage = {
            buffer: readFileSync(process.cwd() + "/src/seed/cambienkhoi.jpg"),
        } as MemoryStoredFile;
        for (let floor of floors) {
            for (let i = 0; i < 5; i++)
                equipments.push(
                    await this.equipmentService.create({
                        name: "Cam bien khoi",
                        images: [cambienkhoiImage],
                        description: "Cam bien khoi",
                        floor_id: floor.floor_id,
                        status: EquipmentStatus.AVAILABLE,
                    }),
                );
        }

        let tulanhImage = {
            buffer: readFileSync(process.cwd() + "/src/seed/tulanh.jpg"),
        } as MemoryStoredFile;
        for (let apartment of apartments) {
            equipments.push(
                await this.equipmentService.create({
                    name: "Tu lanh",
                    images: [tulanhImage],
                    description: "Tu lanh",
                    apartment_id: apartment.apartment_id,
                    status: EquipmentStatus.AVAILABLE,
                }),
            );
        }

        let maylanhImage = {
            buffer: readFileSync(process.cwd() + "/src/seed/maylanh.jpg"),
        } as MemoryStoredFile;
        for (let apartment of apartments) {
            equipments.push(
                await this.equipmentService.create({
                    name: "May lanh",
                    images: [maylanhImage],
                    description: "May lanh",
                    apartment_id: apartment.apartment_id,
                    status: EquipmentStatus.AVAILABLE,
                }),
            );
        }

        return equipments;
    }
    async createDemoBuildings(): Promise<Building[]> {
        let buildings: Building[] = [];
        for (let i = 0; i < this.NUMBER_OF_BUILDING; i++) {
            const buildingData: Building = await this.buildingService.create({
                name: `Building ${i}`,
                address: faker.location.streetAddress(),
                max_floor: this.NUMBER_OF_FLOOR_PER_BUILDING,
            });
            this.createManagerOfBuilding(buildingData);

            buildings.push(buildingData);
        }

        return buildings;
    }

    async createDemoFloors(buildings: Building[]): Promise<Floor[]> {
        let floors: Floor[] = [];
        for (let building of buildings) {
            for (let i = 0; i < this.NUMBER_OF_FLOOR_PER_BUILDING; i++) {
                floors.push(
                    await this.floorService.create({
                        name: `Floor${i + 1}/${building.name}`,
                        building_id: building.building_id,
                        max_apartment: this.NUMBER_OF_APARTMENT_PER_FLOOR,
                    }),
                );
            }
        }

        return floors;
    }
    async createDemoApartments(floors: Floor[]): Promise<Apartment[]> {
        let apartments: Apartment[] = [];
        for (let floor of floors) {
            for (let i = 0; i < this.NUMBER_OF_APARTMENT_PER_FLOOR - 1; i++) {
                apartments.push(
                    await this.apartmentService.create({
                        name: faker.person.lastName(),
                        images: this.images,
                        length: 20,
                        building_id: floor.building_id,
                        floor_id: floor.floor_id,
                        width: 15,
                        description: faker.lorem.paragraphs({
                            min: 3,
                            max: 5,
                        }),
                        number_of_bathroom: 2,
                        number_of_bedroom: 1,
                        rent: 9000000,
                    }),
                );
            }
        }

        return apartments;
    }
    async createDemoAccountResident() {
        let id = "RESIDENT";
        const resident = await this.dataSource.getRepository(Resident).save({
            id: id,
            profile: {
                date_of_birth: faker.date.birthdate(),
                name: faker.person.fullName(),
                gender: Gender.MALE,
                phone_number: faker.phone.number(),
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "resident/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "resident/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO RESIDENT"),
                    "resident/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: "resident@gmail.com",
                password: this.hashService.hash("password"),
            },
        });
    }

    async createDemoTechnician() {
        let id = "TEC" + this.idGenerator.generateId();
        const technician = await this.dataSource
            .getRepository(Technician)
            .save({
                id: id,
                profile: {
                    date_of_birth: new Date("1999-01-01"),
                    name: "DEMO TECHNICIAN",
                    gender: Gender.MALE,
                    phone_number: "0896666666",
                    front_identify_card_photo_URL:
                        await this.storageManager.upload(
                            this.frontIdentity.buffer,
                            "technician/" + id + "/frontIdentifyPhoto.jpg",
                            "image/jpeg",
                        ),
                    back_identify_card_photo_URL:
                        await this.storageManager.upload(
                            this.backIdentity.buffer,
                            "technician/" + id + "/backIdentifyPhoto.jpg",
                            "image/jpeg",
                        ),
                    identify_number: faker.string.numeric(12),
                    avatarURL: await this.storageManager.upload(
                        await this.avatarGenerator.generateAvatar(
                            "DEMO TECHNICIAN",
                        ),
                        "technician/" + id + "/avatar.svg",
                        "image/svg+xml",
                    ),
                },
                account: {
                    owner_id: id,
                    email: "technician@gmail.com",
                    password: this.hashService.hash("password"),
                },
            });
    }

    async createManagerOfBuilding(building: Building) {
        let id = "MNG" + this.idGenerator.generateId();
        const manager = await this.dataSource.getRepository(Manager).save({
            id: id,
            profile: {
                date_of_birth: faker.date.birthdate(),
                name: faker.person.fullName(),
                gender: Gender.MALE,
                phone_number: faker.phone.number(),
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "manager/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "manager/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar(id),
                    "manager/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: faker.internet.email(),
                password: this.hashService.hash("password"),
            },
            building: building,
        });
    }
    async createDemoManager() {
        let id = "MNG" + this.idGenerator.generateId();
        const building = (await this.dataSource
            .getRepository(Building)
            .findOne({
                where: {
                    name: "Building 0",
                },
            })) as Building;
        const manager = await this.dataSource.getRepository(Manager).save({
            id: id,
            profile: {
                date_of_birth: new Date("1999-01-01"),
                name: "DEMO MANAGER",
                gender: Gender.MALE,
                phone_number: "0677778787",
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "manager/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "manager/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO MANAGER"),
                    "manager/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: "manager@gmail.com",
                password: this.hashService.hash("password"),
            },
            building: building,
        });
    }

    async createDemoResident(index, apartment_id: string) {
        let id = "RES" + this.idGenerator.generateId();
        const apartmentData = (await this.dataSource
            .getRepository(Apartment)
            .findOne({
                where: {
                    apartment_id,
                },
            })) as Apartment;
        const resident = await this.dataSource.getRepository(Resident).save({
            id: id,
            profile: {
                date_of_birth: faker.date.birthdate(),
                name: faker.person.fullName(),
                gender: Gender.MALE,
                phone_number: faker.phone.number(),
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "resident/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "resident/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO RESIDENT"),
                    "resident/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            // stay_at: apartment,
            account:
                index % 2 === 0
                    ? {
                          owner_id: id,
                          email: faker.internet.email(),
                          password: this.hashService.hash("password"),
                      }
                    : undefined,
            stay_at: apartmentData,
        });
    }

    async createDemoEmployee(index) {
        let id = "EMP" + this.idGenerator.generateId();
        const employee = await this.dataSource.getRepository(Employee).save({
            id: id,
            profile: {
                date_of_birth: faker.date.birthdate(),
                name: faker.person.fullName(),
                gender: Gender.MALE,
                phone_number: faker.string.numeric(10),
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "employee/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "employee/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO EMPLOYEE"),
                    "employee/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
        });
    }

    async createDemoAdmin() {
        let id = "ADM" + this.idGenerator.generateId();
        const admin = await this.dataSource.getRepository(Admin).save({
            id: id,
            profile: {
                date_of_birth: new Date("1999-01-01"),
                name: "DEMO ADMIN",
                gender: Gender.MALE,
                phone_number: "0755555555",
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "admin/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "admin/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO ADMIN"),
                    "admin/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: "admin@gmail.com",
                password: this.hashService.hash("password"),
            },
        });
    }
    async createDemoApartment(id?: string) {
        let apartmentId = "APM" + this.idGenerator.generateId();
        if (id) apartmentId = id;
        await this.apartmentService.create(
            {
                name: "St. Crytal",
                images: this.images,
                length: 20,
                building_id: this.floors[0].building_id,
                floor_id: this.floors[0].floor_id,
                width: 15,
                description: faker.lorem.paragraphs({
                    min: 3,
                    max: 5,
                }),
                number_of_bathroom: 2,
                number_of_bedroom: 1,
                rent: 9000000,
            },
            apartmentId,
        );
    }

    async createDemoContract() {
        await this.createDemoApartment("APM1698502960091");
        let contractId = "CT" + this.idGenerator.generateId();
        await this.dataSource.getRepository(Contract).save({
            contract_id: contractId,
            resident_id: "RESIDENT",
            apartment_id: "APM1698502960091",
            expire_at: new Date("2030-01-01"),
            role: ContractRole.RENT,
            status: ContractStatusRole.INACTIVE,
        });
    }
    async createDemoServices() {
        await this.serviceService.create(
            {
                name: `Hồ bơi`,
                images: [this.pool],
                description: `This is pool service`,
            },
            `Service${0}`,
        );
        await this.serviceService.create(
            {
                name: `Gym`,
                images: [this.gym],
                description: `This is gym service`,
            },
            `Service${1}`,
        );
        await this.serviceService.create(
            {
                name: `Thư viện`,
                images: [this.library],
                description: `This is library service`,
            },
            `Service${2}`,
        );
        await this.serviceService.create(
            {
                name: `Bãi giữ xe`,
                images: [this.parking],
                description: `This is parking service`,
            },
            `Service${3}`,
        );
    }
    async createDemoServicePackages() {
        let ServicePackageInfo: any[] = [];
        //pool

        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${0}-${0}`,
            service_id: `Service${0}`,
            name: `day`,
            expired_date: 1,
            per_unit_price: 50000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${0}-${1}`,
            service_id: `Service${0}`,
            name: `week`,
            expired_date: 7,
            per_unit_price: 300000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${0}-${2}`,
            service_id: `Service${0}`,
            name: `month`,
            expired_date: 30,
            per_unit_price: 1000000,
        });
        //gym
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${1}-${0}`,
            service_id: `Service${1}`,
            name: `day`,
            expired_date: 1,
            per_unit_price: 25000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${1}-${1}`,
            service_id: `Service${1}`,
            name: `week`,
            expired_date: 7,
            per_unit_price: 120000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${1}-${2}`,
            service_id: `Service${1}`,
            name: `month`,
            expired_date: 30,
            per_unit_price: 280000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${1}-${3}`,
            service_id: `Service${1}`,
            name: `quarter`,
            expired_date: 120,
            per_unit_price: 1000000,
        });
        //library
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${2}-${0}`,
            service_id: `Service${2}`,
            name: `day`,
            expired_date: 1,
            per_unit_price: 10000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${2}-${1}`,
            service_id: `Service${2}`,
            name: `week`,
            expired_date: 7,
            per_unit_price: 100000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${2}-${2}`,
            service_id: `Service${2}`,
            name: `month`,
            expired_date: 30,
            per_unit_price: 350000,
        });
        //parking
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${3}-${0}`,
            service_id: `Service${3}`,
            name: `day`,
            expired_date: 1,
            per_unit_price: 5000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${3}-${1}`,
            service_id: `Service${3}`,
            name: `week`,
            expired_date: 7,
            per_unit_price: 30000,
        });
        ServicePackageInfo.push({
            servicePackage_id: `ServicePackage${3}-${2}`,
            service_id: `Service${3}`,
            name: `month`,
            expired_date: 30,
            per_unit_price: 70000,
        });
        await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(ServicePackage)
            .values(ServicePackageInfo)
            .execute();
    }
    async createDemoInvoices() {
        let InvoiceInfo: any[] = [];
        let residents: Resident[] = await this.residentService.findAll();
        let servicePackages: ServicePackage[] =
            await this.servicePackageService.findAll();

        for (let resident of residents) {
            for (let servicePackage of servicePackages) {
                // Calculate the expiration date
                const currentDate = new Date();
                const expirationDate = new Date();
                expirationDate.setDate(
                    currentDate.getDate() + (servicePackage?.expired_date ?? 0),
                );
                await this.invoiceService.create(
                    `Invoice${servicePackage.servicePackage_id}-${resident.id}`,
                    {
                        buyer_id: resident.id,
                        servicePackage_id: servicePackage.servicePackage_id,
                        amount: 1,
                        total: servicePackage.per_unit_price,
                    },
                );
            }
        }
    }
    async createDemoResidents() {
        for (let apartment of this.apartments) {
            for (let i = 0; i < this.NUMBER_OF_RESIDENT; i++) {
                await this.createDemoResident(i, apartment.apartment_id);
            }
        }
    }
    async createDemoEmployees() {
        for (let i = 0; i < this.NUMBER_OF_EMPLOYEE; i++) {
            await this.createDemoEmployee(i);
        }
    }
}

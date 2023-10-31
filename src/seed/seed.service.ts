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

@Injectable()
export class SeedService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly storageManager: StorageManager,
        private readonly idGenerator: IdGenerator,
        private readonly hashService: HashService,
        private readonly avatarGenerator: AvatarGenerator,
        private readonly apartmentService: ApartmentService,
    ) {}

    async dropDB() {
        try {
            await this.storageManager.destroyStorage();
            await this.dataSource.dropDatabase();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createDB() {
        try {
            await this.storageManager.initiateStorage();
            await this.dataSource.synchronize();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    private readonly NUMBER_OF_BUILDING = 5;
    private readonly NUMBER_OF_FLOOR_PER_BUILDING = 5;
    private readonly NUMBER_OF_APARTMENT_PER_FLOOR = 6;
    private readonly NUMBER_OF_RESIDENT = 600;
    private readonly NUMBER_OF_EMPLOYEE = 10;
    private readonly NUMBER_OF_MANAGER = 10;
    private readonly NUMBER_OF_TECHNICIAN = 10;
    private readonly NUMBER_OF_ADMIN = 2;

    private readonly frontIdentity = {
        buffer: readFileSync(process.cwd() + "/src/seed/front.jpg"),
    } as MemoryStoredFile;

    private readonly backIdentity = {
        buffer: readFileSync(process.cwd() + "/src/seed/back.jpg"),
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

    async startSeeding() {
        // Create demo building
        let buildingInfo: any[] = [];
        for (let i = 0; i < this.NUMBER_OF_BUILDING; i++) {
            buildingInfo.push({
                building_id: `BLD${i}`,
                name: `Building ${i}`,
                address: faker.location.streetAddress(),
            });
        }
        await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(Building)
            .values(buildingInfo)
            .execute();

        // Create demo floors
        let floorInfo: any[] = [];
        for (let building of buildingInfo) {
            for (let i = 0; i < this.NUMBER_OF_FLOOR_PER_BUILDING; i++) {
                floorInfo.push({
                    floor_id: `${building.building_id}/FLR${i}`,
                    name: `Floor ${i}`,
                    building_id: building.building_id,
                });
            }
        }
        await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(Floor)
            .values(floorInfo)
            .execute();

        // Create demo apartments
        let apartmentIds: any[] = [];
        for (let floor of floorInfo) {
            for (let i = 0; i < this.NUMBER_OF_APARTMENT_PER_FLOOR; i++) {
                apartmentIds.push(
                    (
                        await this.apartmentService.create({
                            name: "St. Crytal",
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
                        })
                    ).apartment_id,
                );
            }
        }

        // Create demo admin
        await this.createDemoAdmin();
    }

    async createDemoAdmin() {
        let admin = this.dataSource.getRepository(Admin).create();
        admin.id = "ADM" + this.idGenerator.generateId();
        admin.profile = {
            date_of_birth: new Date("1999-01-01"),
            name: "Admin",
            gender: Gender.FEMALE,
            phone_number: "0888888888",
            front_identify_card_photo_URL: await this.storageManager.upload(
                this.frontIdentity.buffer,
                "admin/" + admin.id + "/frontIdentifyPhoto.jpg",
                "image/jpeg",
            ),
            back_identify_card_photo_URL: await this.storageManager.upload(
                this.backIdentity.buffer,
                "admin/" + admin.id + "/backIdentifyPhoto.jpg",
                "image/jpeg",
            ),
        };

        const randomAvatar = await this.avatarGenerator.generateAvatar(
            admin.profile.name,
        );
        let account = {
            account_id: "ACC" + this.idGenerator.generateId(),
            email: "admin@gmail.com",
            password: this.hashService.hash("password"),
            avatarURL: await this.storageManager.upload(
                randomAvatar,
                "admin/" + admin.id + "/avatar.svg",
                "image/svg+xml",
            ),
        };

        await this.dataSource.getRepository(Admin).save({
            account,
            ...admin,
        });
    }
}

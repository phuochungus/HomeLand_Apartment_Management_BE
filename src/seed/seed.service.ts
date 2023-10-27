import { Injectable } from "@nestjs/common";
import { PersonRepository } from "../person/person.service";
import { Gender, PersonRole } from "../person/entities/person.entity";
import { readFileSync } from "fs";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Floor } from "../floor/entities/floor.entity";
import { Building } from "../building/entities/building.entity";
import { ApartmentService } from "../apartment/apartment.service";
import { StorageManager } from "../storage/storage.service";
import { faker } from "@faker-js/faker";
import { CreatePersonDto } from "../person/dto/create-person.dto";

@Injectable()
export class SeedService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly personService: PersonRepository,
        private readonly apartmentRepository: ApartmentService,
        private readonly storageManager: StorageManager,
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

    async startSeeding() {
        const frontIdentity = {
            buffer: readFileSync(process.cwd() + "/src/seed/front.jpg"),
        } as Express.Multer.File;

        const backIdentity = {
            buffer: readFileSync(process.cwd() + "/src/seed/back.jpg"),
        } as Express.Multer.File;

        const images = [
            {
                buffer: readFileSync(process.cwd() + "/src/seed/room.jpg"),
            } as Express.Multer.File,
            {
                buffer: readFileSync(process.cwd() + "/src/seed/room (2).jpg"),
            } as Express.Multer.File,
            {
                buffer: readFileSync(process.cwd() + "/src/seed/room (3).jpg"),
            } as Express.Multer.File,
            {
                buffer: readFileSync(process.cwd() + "/src/seed/room (4).jpg"),
            } as Express.Multer.File,
            {
                buffer: readFileSync(process.cwd() + "/src/seed/room (5).jpg"),
            } as Express.Multer.File,
        ];

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

        const avatars = [
            {
                buffer: readFileSync(process.cwd() + "/src/seed/avatar1.jpg"),
            } as Express.Multer.File,
            {
                buffer: readFileSync(process.cwd() + "/src/seed/avatar2.jpg"),
            } as Express.Multer.File,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ];

        let apartmentIds: any[] = [];
        for (let floor of floorInfo) {
            for (let i = 0; i < this.NUMBER_OF_APARTMENT_PER_FLOOR; i++) {
                apartmentIds.push(
                    (
                        await this.apartmentRepository.create({
                            name: "St. Crytal",
                            images: images,
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

        await this.createRandomPerson({
            role: PersonRole.RESIDENT,
            stay_at_apartment_id: faker.helpers.arrayElement(apartmentIds),
            front_identify_card_photo: frontIdentity,
            back_identify_card_photo: backIdentity,
            email: "resident@gmail.com",
            avatar_photo: faker.helpers.arrayElement(avatars),
        });

        await this.createRandomPerson({
            role: PersonRole.ADMIN,
            front_identify_card_photo: frontIdentity,
            back_identify_card_photo: backIdentity,
            email: "admin@gmail.com",
            avatar_photo: faker.helpers.arrayElement(avatars),
        });

        await this.createRandomPerson({
            role: PersonRole.MANAGER,
            front_identify_card_photo: frontIdentity,
            back_identify_card_photo: backIdentity,
            email: "manager@gmail.com",
            avatar_photo: faker.helpers.arrayElement(avatars),
        });

        await this.createRandomPerson({
            role: PersonRole.TECHINICIAN,
            front_identify_card_photo: frontIdentity,
            back_identify_card_photo: backIdentity,
            email: "technician@gmail.com",
            avatar_photo: faker.helpers.arrayElement(avatars),
        });

        await this.createRandomPerson({
            role: PersonRole.EMPLOYEE,
            front_identify_card_photo: frontIdentity,
            back_identify_card_photo: backIdentity,
        });

        for (let i = 0; i < this.NUMBER_OF_RESIDENT - 1; i++) {
            await this.createRandomPerson({
                role: PersonRole.RESIDENT,
                front_identify_card_photo: frontIdentity,
                back_identify_card_photo: backIdentity,
                stay_at_apartment_id: faker.helpers.arrayElement(apartmentIds),
                avatar_photo: faker.helpers.arrayElement(avatars),
            });
        }

        for (let i = 0; i < this.NUMBER_OF_EMPLOYEE - 1; i++) {
            await this.createRandomPerson({
                role: PersonRole.EMPLOYEE,
                front_identify_card_photo: frontIdentity,
                back_identify_card_photo: backIdentity,
            });
        }

        for (let i = 0; i < this.NUMBER_OF_ADMIN - 1; i++) {
            await this.createRandomPerson({
                role: PersonRole.ADMIN,
                front_identify_card_photo: frontIdentity,
                back_identify_card_photo: backIdentity,
                avatar_photo: faker.helpers.arrayElement(avatars),
            });
        }

        for (let i = 0; i < this.NUMBER_OF_TECHNICIAN - 1; i++) {
            await this.createRandomPerson({
                role: PersonRole.TECHINICIAN,
                front_identify_card_photo: frontIdentity,
                back_identify_card_photo: backIdentity,
                avatar_photo: faker.helpers.arrayElement(avatars),
            });
        }

        for (let i = 0; i < this.NUMBER_OF_MANAGER - 1; i++) {
            await this.createRandomPerson({
                role: PersonRole.MANAGER,
                front_identify_card_photo: frontIdentity,
                back_identify_card_photo: backIdentity,
                avatar_photo: faker.helpers.arrayElement(avatars),
            });
        }
    }

    private async createRandomPerson(partialCreatePersonDto: {
        role: PersonRole;
        front_identify_card_photo: Express.Multer.File;
        back_identify_card_photo: Express.Multer.File;
        avatar_photo?: Express.Multer.File;
        email?: string;
        stay_at_apartment_id?: string;
    }) {
        const { role, email } = partialCreatePersonDto;
        const gender = faker.helpers.arrayElement([Gender.FEMALE, Gender.MALE]);
        const account = {
            email:
                role == PersonRole.EMPLOYEE
                    ? undefined
                    : email || faker.internet.email(),
            password: role == PersonRole.EMPLOYEE ? undefined : "password",
            activate_at: role == PersonRole.EMPLOYEE ? null : new Date(),
            avatar_photo:
                role == PersonRole.EMPLOYEE
                    ? undefined
                    : partialCreatePersonDto.avatar_photo,
        };

        let createPersonDto: CreatePersonDto = {
            ...partialCreatePersonDto,
            ...account,
            name: faker.person.fullName({ sex: gender }),
            gender,
            phone_number: faker.phone.number(),
            date_of_birth: faker.date.between({
                from: new Date(1930, 1, 1),
                to: new Date(2000, 1, 1),
            }),
        };
        await this.personService.create(createPersonDto);
    }
}

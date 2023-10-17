import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { PersonRepository } from "../person/person.service";
import { Gender, PersonRole } from "../person/entities/person.entity";
import { readFileSync } from "fs";

@Injectable()
export class SeedingService {
    constructor(private readonly personService: PersonRepository) {}

    async startSeeding() {
        console.log(process.cwd() + "/src/seeding/identify.png");
        const fakeImage = readFileSync(
            process.cwd() + "/src/seeding/identify.png",
        );
        const fakeFile = {
            mimetype: "image/png",
            buffer: fakeImage,
        };

        const admin = await this.personService.create({
            name: "DEMO ADMIN",
            gender: Gender.FEMALE,
            phone_number: "0811111111",
            date_of_birth: new Date("1872-05-27"),
            role: PersonRole.ADMIN,
            back_identify_card_photo: fakeFile as Express.Multer.File,
            front_identify_card_photo:
                fakeFile as Express.Multer.File,
        });

        const resident = await this.personService.create({
            name: "DEMO RESIDENT",
            gender: Gender.MALE,
            phone_number: "0555555555",
            date_of_birth: new Date("1900-01-31"),
            role: PersonRole.RESIDENT,
            back_identify_card_photo: fakeFile as Express.Multer.File,
            front_identify_card_photo:
                fakeFile as Express.Multer.File,
        });

        const manager = await this.personService.create({
            name: "DEMO MANAGER",
            gender: Gender.FEMALE,
            phone_number: "0808080808",
            date_of_birth: new Date("1960-07-26"),
            role: PersonRole.MANAGER,
            back_identify_card_photo: fakeFile as Express.Multer.File,
            front_identify_card_photo:
                fakeFile as Express.Multer.File,
        });

        const technician = await this.personService.create({
            name: "DEMO TECHNICIAN",
            gender: Gender.MALE,
            phone_number: "0303030303",
            date_of_birth: new Date("1989-12-20"),
            role: PersonRole.TECHINICIAN,
            back_identify_card_photo: fakeFile as Express.Multer.File,
            front_identify_card_photo:
                fakeFile as Express.Multer.File,
        });

        const employee = await this.personService.create({
            name: "DEMO EMPLOYEE",
            gender: Gender.FEMALE,
            phone_number: "0956565656",
            date_of_birth: new Date("1970-8-22"),
            role: PersonRole.EMPLOYEE,
            back_identify_card_photo: fakeFile as Express.Multer.File,
            front_identify_card_photo:
                fakeFile as Express.Multer.File,
        });
    }
}

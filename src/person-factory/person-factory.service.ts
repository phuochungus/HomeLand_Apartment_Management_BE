import { Injectable } from "@nestjs/common";
import { CreatePersonDto } from "../person/dto/create-person.dto";
import { OmitType } from "@nestjs/swagger";
import {
    Admin,
    Employee,
    Manager,
    Person,
    Resident,
    Technician,
} from "../person/entities/person.entity";
import { plainToInstance } from "class-transformer";
import { IdGenerator } from "../id-generator/id-generator.service";
import { PersonRole } from "../helper/class/profile.entity";

export class PersonInfo extends OmitType(CreatePersonDto, [
    "back_identify_card_photo",
    "front_identify_card_photo",
]) {}

/**
 * Factory Pattern
 * Factory create person by role
 */
@Injectable()
export class PersonFactory {
    constructor(private readonly idGenerator: IdGenerator) {}
    create(personInfo: PersonInfo): Person {
        switch (personInfo.role) {
            case PersonRole.ADMIN:
                const admin = plainToInstance(Admin, personInfo);
                admin.id = "ADM" + this.idGenerator.generateId();
                return admin;
            case PersonRole.EMPLOYEE:
                const employee = plainToInstance(Employee, personInfo);
                employee.id = "EMP" + this.idGenerator.generateId();
                return employee;
            case PersonRole.MANAGER:
                const manager = plainToInstance(Manager, personInfo);
                manager.id = "MNG" + this.idGenerator.generateId();
                return manager;
            case PersonRole.RESIDENT:
                const resident = plainToInstance(Resident, personInfo);
                resident.id = "RES" + this.idGenerator.generateId();
                return resident;
            case PersonRole.TECHNICIAN:
                const technician = plainToInstance(Technician, personInfo);
                technician.id = "TEC" + this.idGenerator.generateId();
                return technician;
            default:
                throw new Error("Factory unable to create");
        }
    }
}

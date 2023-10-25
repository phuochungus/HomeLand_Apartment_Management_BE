
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TypeORMError } from "typeorm";
import { Person, PersonRole } from "./entities/person.entity";
import { hashSync } from "bcrypt";
import { UploadService } from "../upload/upload.service";
import { BaseRepository } from "../helper/base/base-repository.abstract";
import { isQueryAffected } from "../helper/validation";
import { HashService } from "../hash/hash.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { PersonFactory } from "../person-factory/person-factory.service";
import { async } from 'rxjs';

/**
 * Person repository interface
 */
export abstract class PersonRepository extends BaseRepository<
    CreatePersonDto,
    Person
> {
    abstract findOneByEmail(email: string): Promise<Person | null>;
    abstract create(
        createPersonDto: CreatePersonDto,
        creatorRole?: PersonRole,
    ): Promise<Person>;
    abstract createAccount(
        id: string,
        createAccountDto: CreateAccountDto,
    ): Promise<Person>;
}


@Injectable()
export class PersonService implements PersonRepository {
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly uploadService: UploadService,
        private readonly hashService: HashService,
    ) {}
    //get person by id
    //create person
    async create(
        createPersonDto: CreatePersonDto,
        creatorRole?: PersonRole,
    ): Promise<Person> {
        if (creatorRole) {
            switch (createPersonDto.role) {
                case PersonRole.ADMIN:
                    if (creatorRole !== PersonRole.ADMIN)
                        throw new UnauthorizedException(
                            "Creator's role is not sufficient",
                        );
                    break;

                case PersonRole.MANAGER:
                    if (creatorRole !== PersonRole.ADMIN)
                        throw new UnauthorizedException(
                            "Creator's role is not sufficient",
                        );
                    break;

                case PersonRole.RESIDENT:
                    if (
                        !(
                            creatorRole == PersonRole.MANAGER ||
                            creatorRole == PersonRole.ADMIN
                        )
                    ) {
                        throw new UnauthorizedException(
                            "Creator's role is not sufficient",
                        );
                    }
                    break;

                case PersonRole.TECHINICIAN:
                    if (
                        !(
                            creatorRole == PersonRole.MANAGER ||
                            creatorRole == PersonRole.ADMIN
                        )
                    ) {
                        throw new UnauthorizedException(
                            "Creator's role is not sufficient",
                        );
                    }
                    break;

                default:
                    break;
            }
        }
        const {
            front_identify_card_photo,
            back_identify_card_photo,
            ...rest
        } = createPersonDto;
        console.log(rest);
        let person = PersonFactory.create(rest);
        console.log(person);
        if (person.password) {
            person.password = this.hashService.hash(person.password);
        }

        try {
            const frontURL = await this.uploadService.upload(
                front_identify_card_photo,
                "person/" +
                    person.id +
                    "/front_identify_card_photo_URL.png",
                "image/png",
            );
            const backURL = await this.uploadService.upload(
                back_identify_card_photo,
                "person/" +
                    person.id +
                    "/back_identify_card_photo_URL.png",
                "image/png",
            );
            person.front_identify_card_photo_URL = frontURL;
            person.back_identify_card_photo_URL = backURL;
            return await this.personRepository.save(person);
        } catch (error) {
            if (error instanceof TypeORMError) {
                try {
                    await this.uploadService.remove([
                        "/person/" +
                            person.id +
                            "/front_identify_card_photo_URL.png",
                        "/person/" +
                            person.id +
                            "/back_identify_card_photo_URL.png",
                    ]);
                } catch (error) {
                    console.error(error);
                }
            }
            throw error;
        }
    }

    async createAccount(
        id: string,
        createAccountDto: CreateAccountDto,
    ): Promise<Person> {
        let person = await this.personRepository.findOne({
            where: { id },
        });
        if (!person) throw new NotFoundException();
        if (person.password)
            throw new ConflictException(
                "Person profile already has account",
            );
        person.email = createAccountDto.email;
        person.password = hashSync(createAccountDto.password, 10);

        return await this.personRepository.save(person);
    }

    findOne(id: string): Promise<Person | null> {
        return this.personRepository.findOne({
            where: {
                id,
            },
            cache: true,
        });
    }

    findOneByEmail(email: string): Promise<Person | null> {
        return this.personRepository.findOne({
            where: {
                email,
            },
            cache: true,
        });
    }

    findAll(): Promise<Person[]> {
        return this.personRepository.find({
            cache: true,
        });
    }

    async update(id: string, updatePersonDto: UpdatePersonDto) {
        let result = await this.personRepository.update(
            id,
            updatePersonDto,
        );
        return isQueryAffected(result);
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.personRepository.softDelete({ id });
        return isQueryAffected(result);
    }

    async hardDelete?(id: any): Promise<boolean> {
        try {
            const result = await this.personRepository.delete({ id });
            return isQueryAffected(result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

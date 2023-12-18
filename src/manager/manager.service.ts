import { UpdateManagerDto } from "./dto/update-manager.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository, TypeORMError } from "typeorm";
import { StorageManager } from "../storage/storage.service";
import { AvatarGenerator } from "../avatar-generator/avatar-generator.service";
import { MemoryStoredFile } from "nestjs-form-data";
import { Profile } from "../helper/class/profile.entity";
import { IdGenerator } from "src/id-generator/id-generator.service";
import { plainToInstance } from "class-transformer";
import { Account } from "src/account/entities/account.entity";
import { HashService } from "src/hash/hash.service";
import { Manager } from "./entities/manager.entity";
import { CreateManagerDto } from "./dto/create-manager.dto";
import { UpdateResult } from "typeorm/browser";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { paginate } from "nestjs-typeorm-paginate/dist/paginate";
import { IPaginationMeta } from "nestjs-typeorm-paginate/dist/interfaces";
/**
 * Person repository interface
 */
@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        private readonly storageManager: StorageManager,
        private readonly hashService: HashService,
        private readonly idGenerate: IdGenerator,
        private readonly avatarGenerator: AvatarGenerator,
    ) {}
    //get person by id
    //create person

    /**
     * Create a person and insert into database
     * @param createPersonDto JSON object to create person
     * @param creatorRole role of who evoke this function
     * @default creatorRole undefined
     * @param id set the id of person, if not set, id will be generated
     * @default id undefined
     * @returns inserted person
     */
    async create(createManagerDto: CreateManagerDto): Promise<Manager> {
        const {
            front_identify_card_photo,
            back_identify_card_photo,
            avatar_photo,
            email,
            ...rest
        } = createManagerDto;

        const profile = plainToInstance(Profile, rest);
        let manager = new Manager();
        manager.id = "MNG" + this.idGenerate.generateId();
        try {
            const frontPhoto = front_identify_card_photo as MemoryStoredFile;
            const backPhoto = front_identify_card_photo as MemoryStoredFile;
            const frontURL = await this.storageManager.upload(
                frontPhoto.buffer,
                "manager/" +
                    manager.id +
                    "/front_identify_card_photo_URL." +
                    (frontPhoto.extension || "png"),
                frontPhoto.mimetype || "image/png",
            );
            const backURL = await this.storageManager.upload(
                backPhoto.buffer,
                "manager/" +
                    manager.id +
                    "/back_identify_card_photo_URL." +
                    (backPhoto.extension || "png"),
                backPhoto.mimetype || "image/png",
            );
            let avatarURL: string | undefined;
            // const avatarPhoto = avatar_photo as MemoryStoredFile;

            if (avatar_photo) {
                const avataPhoto = avatar_photo as MemoryStoredFile;
                avatarURL = await this.storageManager.upload(
                    avataPhoto.buffer,
                    "manager/" +
                        manager.id +
                        "/avatarURL." +
                        (avataPhoto.extension || "png"),
                    avataPhoto.mimetype || "image/png",
                );
            } else {
                const avatar = await this.avatarGenerator.generateAvatar(
                    profile.name,
                );
                avatarURL = await this.storageManager.upload(
                    avatar,
                    "manager/" + manager.id + "/avatarURL.svg",
                    "image/svg+xml",
                );
            }

            profile.front_identify_card_photo_URL = frontURL;
            profile.back_identify_card_photo_URL = backURL;
            profile.avatarURL = avatarURL;
            manager.profile = profile;
            const managerData = await this.managerRepository.save(manager);
            //set account
            let account = new Account();
            account.owner_id = manager.id;
            account.email = email;
            account.password = this.hashService.hash(profile.phone_number);
            account.manager = manager;
            await this.accountRepository.save(account);
            return managerData;
        } catch (error) {
            if (error instanceof TypeORMError) {
                try {
                    await this.storageManager.remove([
                        "/manager/" +
                            manager.id +
                            "/front_identify_card_photo_URL.png",
                        "/manager/" +
                            manager.id +
                            "/back_identify_card_photo_URL.png",
                    ]);
                } catch (error) {
                    console.error(error);
                }
            }
            throw error;
        }
    }
    async search(query: string): Promise<Manager[]> {
        const result = await this.managerRepository.find({
            where: {
                profile: { name: Like(`%${query}%`) },
            },
        });

        return result;
    }
    async update(
        id: string,
        updateManagerDto: UpdateManagerDto,
    ): Promise<Manager | null> {
        let manager = await this.managerRepository.findOne({
            where: { id },
        });
        const { avatar_photo, email, ...rest } = updateManagerDto;
        if (!manager) throw new NotFoundException();
        let profile = plainToInstance(Profile, rest);
        let avatarURL: string | undefined;
        if (avatar_photo) {
            const avataPhoto = avatar_photo as MemoryStoredFile;
            avatarURL = await this.storageManager.upload(
                avataPhoto.buffer,
                "manager/" +
                    manager.id +
                    "/avatarURL." +
                    (avataPhoto.extension || "png"),
                avataPhoto.mimetype || "image/png",
               
            );
            profile.avatarURL = avatarURL;
        } 
        try {
            await this.accountRepository.update(id, {
                email
            });
        manager.profile = profile;
        
         await this.managerRepository.update(id,{
            profile
        } );
        return await this.managerRepository.findOne({
            where: {
                id
            },
            relations: ["account", "building"],
        })
        }
        catch(err) {
            throw new Error('Count not update manager');
        }
    }
    findOne(id: string): Promise<Manager | null> {
        return this.managerRepository.findOne({
            where: {
                id,
            },
            cache: true,
            relations: ["account", "building"],
            withDeleted: true 
        });
    }
    async delete(id: string) {
        try {
            const result = await this.managerRepository.softDelete({ id });
            return result;
        } catch (e) {
            throw new Error("Could not delete manager");
        }
    }
    async findAll(): Promise<Manager[]> {
        const managers = await this.managerRepository.find({
            relations: ["account", "building"],
            withDeleted: true 
        });
        return managers;
    }
    async paginate(options: IPaginationOptions<IPaginationMeta>) {
        const result = this.managerRepository.createQueryBuilder("manager").leftJoinAndSelect("manager.account", "account").leftJoinAndSelect("manager.building", "building")
        return paginate<Manager>(result, options)
    }
}

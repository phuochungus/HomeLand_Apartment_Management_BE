
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
import { UpdateResult } from "typeorm/browser";
import { Technician } from "./entities/technician.entity";
import { CreateTechnicianDto } from "./dto/create-technician.dto";
import { UpdateTechnicianDto } from "./dto/update-technician.dto";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { paginate } from "nestjs-typeorm-paginate/dist/paginate";
import { IPaginationMeta } from "nestjs-typeorm-paginate/dist/interfaces";

/**
 * Person repository interface
 */
@Injectable()
export class TechnicianService {
    constructor(
        @InjectRepository(Technician)
        private readonly technicianRepository: Repository<Technician>,
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
    async create(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
        const {
            front_identify_card_photo,
            back_identify_card_photo,
            avatar_photo,
            email,
            ...rest
        } = createTechnicianDto;

        const profile = plainToInstance(Profile, rest);
        let technician = new Technician();
        technician.id = "TEC" + this.idGenerate.generateId();
        try {
            const frontPhoto = front_identify_card_photo as MemoryStoredFile;
            const backPhoto = front_identify_card_photo as MemoryStoredFile;
            const frontURL = await this.storageManager.upload(
                frontPhoto.buffer,
                "technician/" +
                technician.id +
                    "/front_identify_card_photo_URL." +
                    (frontPhoto.extension || "png"),
                frontPhoto.mimetype || "image/png",
            );
            const backURL = await this.storageManager.upload(
                backPhoto.buffer,
                "technician/" +
                technician.id +
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
                    "technician/" +
                    technician.id +
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
                    "technician/" + technician.id + "/avatarURL.svg",
                    "image/svg+xml",
                );
            }

            profile.front_identify_card_photo_URL = frontURL;
            profile.back_identify_card_photo_URL = backURL;
            profile.avatarURL = avatarURL;
            technician.profile = profile;
            const technicianData = await this.technicianRepository.save(technician);
            //set account
            let account = new Account();
            account.owner_id = technician.id;
            account.email = email;
            account.password = this.hashService.hash(profile.phone_number);
            account.technician = technician;
            await this.accountRepository.save(account);
            return technicianData;
        } catch (error) {
            if (error instanceof TypeORMError) {
                try {
                    await this.storageManager.remove([
                        "/technician/" +
                        technician.id +
                            "/front_identify_card_photo_URL.png",
                        "/technician/" +
                        technician.id +
                            "/back_identify_card_photo_URL.png",
                    ]);
                } catch (error) {
                    console.error(error);
                }
            }
            throw error;
        }
    }
    async search(query: string): Promise<Technician[]> {
        const result = await this.technicianRepository.find({
            where: {
                profile: { name: Like(`%${query}%`) },
            },
        });

        return result;
    }
    async update(
        id: string,
        updateTechnicianDto: UpdateTechnicianDto,
    ): Promise<Technician | null> {
        let technician = await this.technicianRepository.findOne({
            where: { id },
        });
        const { avatar_photo, email, ...rest } = updateTechnicianDto;
        if (!technician) throw new NotFoundException();
        let profile = plainToInstance(Profile, rest);
        let avatarURL: string | undefined;
        if (avatar_photo) {
            const avataPhoto = avatar_photo as MemoryStoredFile;
            avatarURL = await this.storageManager.upload(
                avataPhoto.buffer,
                "technician/" +
                technician.id +
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
            technician.profile = profile;
        
         await this.technicianRepository.update(id,{
            profile
        } );
        return await this.technicianRepository.findOne({
            where: {
                id
            },
            relations: ["account"],
        })
        }
        catch(err) {
            throw new Error('Count not update technician');
        }
          
         
    }
    findOne(id: string): Promise<Technician | null> {
        return this.technicianRepository.findOne({
            where: {
                id,
            },
            cache: true,
            relations: ["account"],
        });
    }
    async delete(id: string) {
        try {
            const result = await this.technicianRepository.softDelete({ id });
            return result;
        } catch (e) {
            throw new Error("Could not delete technician");
        }
    }
    async findAll(): Promise<Technician[]> {
        const technicians = await this.technicianRepository.find({
            relations: ["account"],
        });
        return technicians;
    }
    async paginate(options: IPaginationOptions<IPaginationMeta>) {
        const result = this.technicianRepository.createQueryBuilder("technician").leftJoinAndSelect("technician.account", "account");
        
        return paginate<Technician>(result, options)
    }
  
}

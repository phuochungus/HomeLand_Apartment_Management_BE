
import { UpdateResidentDto } from './dto/update-resident.dto';
import { Resident } from './entities/resident.entity';

import {
    
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TypeORMError } from "typeorm";
import { StorageManager } from 'src/storage/storage.service';
import { isQueryAffected } from "../helper/validation";
import { IRepository } from 'src/helper/interface/IRepository.interface';
import { AvatarGenerator } from "../avatar-generator/avatar-generator.service";
import { MemoryStoredFile } from "nestjs-form-data";
import {  Profile } from "../helper/class/profile.entity";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { IdGenerator } from 'src/id-generator/id-generator.service';
import { plainToInstance } from 'class-transformer';
import { Account } from 'src/helper/class/account.entity';
import { HashService } from 'src/hash/hash.service';


/**
 * Person repository interface
 */
export abstract class ResidentRepository implements IRepository<Resident> {
    abstract findOne(id: string): Promise<Resident | null>;
    abstract update(id: string, updateEntityDto: any): Promise<boolean>;
    abstract delete(id: string): Promise<boolean>;
    // abstract findOneByEmail(email: string): Promise<Resident | null>;
    abstract create(
        createResidentDto: CreateResidentDto,
        id?: string,
    ): Promise<Resident>;
    // abstract createAccount(
    //     id: string,
    //     createAccountDto: CreateAccountDto,
    // ): Promise<Resident>;
    abstract updateResident(
        id: string,
        updateResidentDto: UpdateResidentDto,
    ): Promise<Resident>;
    abstract findAll(): Promise<Resident[]>;
}
    

@Injectable()
export class ResidentService implements ResidentRepository {
    constructor(
        @InjectRepository(Resident)
        private readonly residentRepository: Repository<Resident>,
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
    async create(
        createResidentDto: CreateResidentDto,
        id?: string,
    ): Promise<Resident> {
        const {
            front_identify_card_photo,
            back_identify_card_photo,
            avatar_photo,
            payment_info,

            ...rest
        } = createResidentDto;
        const profile = plainToInstance(Profile, rest)
        let resident = new Resident();
        resident.payment_info = payment_info;
        if (id) resident.id = id;
        else   resident.id = "RES" + this.idGenerate.generateId();
        try {
            const frontPhoto = front_identify_card_photo as MemoryStoredFile;
            const backPhoto = front_identify_card_photo as MemoryStoredFile;
            const frontURL = await this.storageManager.upload(
                frontPhoto,
                "resident/" +
                    resident.id +
                    "/front_identify_card_photo_URL." +
                    (frontPhoto.extension || "png"),
                frontPhoto.mimetype || "image/png",
            );
            const backURL = await this.storageManager.upload(
                backPhoto,
                "resident/" +
                    resident.id +
                    "/back_identify_card_photo_URL." +
                    (backPhoto.extension || "png"),
                backPhoto.mimetype || "image/png",
            );
             
        
            profile.front_identify_card_photo_URL = frontURL;
            profile.back_identify_card_photo_URL = backURL;
            resident.profile = profile;
            resident.account_id = resident.id;
            //set account
            let account = new Account()
            account.id = resident.account_id;
            account.email = rest.email;
            account.password =  this.hashService.hash(profile.phone_number);
            resident.account = account;
            await this.accountRepository.save(account)
            return await this.residentRepository.save(resident);
            
             

        } catch (error) {
            if (error instanceof TypeORMError) {
                try {
                    await this.storageManager.remove([
                        "/resident/" +
                            resident.id +
                            "/front_identify_card_photo_URL.png",
                        "/resident/" +
                            resident.id +
                            "/back_identify_card_photo_URL.png",
                    ]);
                } catch (error) {
                    console.error(error);
                }
            }
            throw error;
        }
    }

    // async createAccount(
    //     id: string,
    //     createAccountDto: CreateAccountDto,
    // ): Promise<Resident> {
    //     let Resident = await this.residentRepository.findOne({
    //         where: { id },
    //     });
    //     if (!Resident) throw new NotFoundException();
    //     // if (Resident.password)
    //     //     throw new ConflictException(
    //     //         "Resident profile already has account",
    //     //     );
    //     Resident.emai = createAccountDto.email;
    //     Resident.phone_number = createAccountDto.email;
    //     //Resident.password = hashSync(createAccountDto.password, 10);

    //     return await this.ResidentRepository.save(Resident);
    // }
    async updateResident(
        id: string,
        updateResidentDto: UpdateResidentDto,
    ): Promise<Resident> {
        let resident = await this.residentRepository.findOne({
            where: { id },
        });
        const {payment_info, avatar_photo, email, ...rest} = updateResidentDto;
        if (!resident) throw new NotFoundException();
        // if (person.password)
        //     throw new ConflictException(
        //         "Person profile already has account",
        //     );
       // resident.account?.email = updateResidentDto.email as string;
      const account = await this.accountRepository.findOne({where: {id}})
       if(account !== null) {
        console.log(account)
       account.email = email as string;
       await this.accountRepository.save(account);
       }
       resident.payment_info = payment_info
       let profile = plainToInstance(Profile, rest)
       let avatarURL: string | undefined;
           // const avatarPhoto = avatar_photo as MemoryStoredFile;
                
                if (avatar_photo) {
                    const avataPhoto = avatar_photo as MemoryStoredFile;
                    avatarURL = await this.storageManager.upload(
                    avataPhoto,
                        "resident/" +
                            resident.id +
                            "/avatarURL." +
                            (avataPhoto.extension || "png"),
                            avataPhoto.mimetype || "image/png",
                    );
                } else {
                    const avatar = await this.avatarGenerator.generateAvatar(
                        profile.name,
                    );
                    avatarURL = await this.storageManager.upload(
                        { buffer: avatar },
                        "resident/" + resident.id + "/avatarURL.svg",
                        "image/svg+xml",
                    );
                }
                profile.avatar_photo = avatarURL;
       resident.profile = profile
        // resident.payment_info = updateResidentDto.payment_info as string;
        // resident.email = updateResidentDto.email as string;
        // resident.phone_number = updateResidentDto.phone_number as string;
        
        //person.password = hashSync(createAccountDto.password, 10);
        return await this.residentRepository.save(resident);
    }
    findOne(id: string): Promise<Resident | null> {
        return this.residentRepository.findOne({
            where: {
                id,

            },
            cache: true,
            relations:['account']
        });
    }

    // findOneByEmail(email: string): Promise<Resident | null> {
    //     return this.residentRepository.findOne({
    //         where: {
    //             ac
    //         },
    //         cache: true,
    //     });
    // }

    async update(id: string, UpdateResidentDto: UpdateResidentDto) {
        let result = await this.residentRepository.update(id, UpdateResidentDto);
        return isQueryAffected(result);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.residentRepository.softDelete({ id });
        return isQueryAffected(result);
    }

    // async hardDelete?(id: any): Promise<boolean> {
    //     try {
    //         const result = await this.residentRepository.delete({ id });
    //         return isQueryAffected(result);
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }
    async findAll(): Promise<Resident[]> {
        const residents = await this.residentRepository.find({
            relations: ['account'],
        })
        return residents;
        
    }
}

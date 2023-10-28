import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";
import { PersonFactoryModule } from "../person-factory/person-factory.module";
import { PersonController } from "./person.controller";
import { PersonRepository, PersonService } from "./person.service";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Person]),
        IdGeneratorModule,
        StorageModule,
        HashModule,
        PersonFactoryModule,
        AvatarGeneratorModule,
    ],
    controllers: [PersonController],
    providers: [
        {
            provide: PersonRepository,
            useClass: PersonService,
        
        },
    ],
})
export class PersonModule {}

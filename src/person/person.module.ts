import { Global, Module } from "@nestjs/common";
import { PersonRepository, PersonService } from "./person.service";
import { PersonController } from "./person.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { IdGeneratorModule } from "../id_generator/id-generator.module";
import { UploadModule } from "../upload/upload.module";
import { HashModule } from "../hash/hash.module";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Person]),
        IdGeneratorModule,
        UploadModule,
        HashModule,
    ],
    controllers: [PersonController],
    providers: [
        {
            provide: PersonRepository,
            useClass: PersonService,
        
        },
    ],
    exports: [PersonRepository],
})
export class PersonModule {}

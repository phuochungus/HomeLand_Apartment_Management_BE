import { Module } from "@nestjs/common";
import { ServicePackageService } from "./service-package.service";
import { ServicePackageController } from "./service-package.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServicePackage } from "./entities/service-package.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("Service Package")
@Module({
    imports: [TypeOrmModule.forFeature([ServicePackage]), IdGeneratorModule],

    controllers: [ServicePackageController],
    providers: [ServicePackageService],
    exports: [ServicePackageService],
})
export class ServicePackageModule {}

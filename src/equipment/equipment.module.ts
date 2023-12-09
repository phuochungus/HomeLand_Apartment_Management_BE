import { Module } from "@nestjs/common";
import { EquipmentService, EquipmentServiceImp } from "./equipment.service";
import { EquipmentController } from "./equipment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Equipment } from "./entities/equipment.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { StorageModule } from "../storage/storage.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Equipment]),
        IdGeneratorModule,
        StorageModule,
    ],
    controllers: [EquipmentController],
    providers: [{ provide: EquipmentService, useClass: EquipmentServiceImp }],
    exports: [EquipmentService],
})
export class EquipmentModule {}

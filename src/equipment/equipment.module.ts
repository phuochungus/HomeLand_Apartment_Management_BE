import { Module } from "@nestjs/common";
import { EquipmentService, EquipmentServiceImp } from "./equipment.service";
import { EquipmentController } from "./equipment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Equipment } from "./entities/equipment.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";

@Module({
    imports: [TypeOrmModule.forFeature([Equipment]), IdGeneratorModule],
    controllers: [EquipmentController],
    providers: [{ provide: EquipmentService, useClass: EquipmentServiceImp }],
})
export class EquipmentModule {}

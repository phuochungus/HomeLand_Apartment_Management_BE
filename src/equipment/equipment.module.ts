import { Module } from "@nestjs/common";
import { EquipmentService, EquipmentServiceImp } from "./equipment.service";
import { EquipmentController } from "./equipment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Equipment } from "./entities/equipment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Equipment])],
    controllers: [EquipmentController],
    providers: [{ provide: EquipmentService, useClass: EquipmentServiceImp }],
})
export class EquipmentModule {}

import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentController } from "./equipment.controller";
import { EquipmentServiceImp } from "./equipment.service";

describe("EquipmentController", () => {
    let controller: EquipmentController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EquipmentController],
            providers: [EquipmentServiceImp],
        }).compile();

        controller = module.get<EquipmentController>(EquipmentController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});

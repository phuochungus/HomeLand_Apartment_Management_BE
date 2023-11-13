import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentServiceImp } from "./equipment.service";

describe("EquipmentService", () => {
    let service: EquipmentServiceImp;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EquipmentServiceImp],
        }).compile();

        service = module.get<EquipmentServiceImp>(EquipmentServiceImp);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
